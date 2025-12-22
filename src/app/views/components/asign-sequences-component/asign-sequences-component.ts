import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../../logic/services/student-service';
import { Student } from '../../../logic/interfaces/student-interface';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
import { SequenceService } from '../../../logic/services/sequence-service';
import { forkJoin } from 'rxjs';
import { StudentSequenceService } from '../../../logic/services/student-sequence-service';

@Component({
  selector: 'app-asign-sequences-component',
  imports: [RouterLink, CommonModule],
  templateUrl: './asign-sequences-component.html',
  styleUrl: './asign-sequences-component.css',
})
export class AsignSequencesComponent implements AfterViewInit {

  @ViewChild('modal') modal!: TemplateRef<any>;

  student: Student | null = null;
  studentId: number | null = null;
  sequences: Sequence[] = [];
  assignedSequences: Sequence[] = [];
  availableSequences: Sequence[] = [];
  selectedSequence: Sequence | null = null;

  constructor(private modalService: NgbModal, private router: Router, private studentService: StudentService, private route: ActivatedRoute, private sequenceService: SequenceService, private studentSequenceService: StudentSequenceService) { }

  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent, { centered: true, backdrop: 'static', keyboard: false });
  }

  ngAfterViewInit(): void {
    this.openModal(this.modal);
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.studentId = Number(id);
      this.loadStudentData(this.studentId);
      this.loadSequences(this.studentId);
    }
  }

  loadStudentData(studentId: number): void {
    this.studentService.getStudentById(studentId).subscribe({
      next: (data) => {
        this.student = data;
      },
      error: (error) => {
        console.error('Error al cargar estudiante', error);
      }
    });
  }

  loadSequences(studentId: number): void {
    this.studentSequenceService.getAvailableSequences(studentId).subscribe({
      next: (data) => {
        this.availableSequences = data;
      },
      error: (error) => {
        console.error('Error al cargar secuencias disponibles:', error);
      }
    });

    this.studentSequenceService.getStudentSequences(studentId).subscribe({
      next: (data) => {
        this.assignedSequences = data;
      },
      error: (error) => {
        console.error("Error al cargar secuencias asignadas:", error);
      }
    });
  }

  selectSequence(seq: Sequence): void {
    this.selectedSequence = seq;
  }

  assignSequence(): void {
    if (!this.selectedSequence || !this.student) {
      return;
    }

    const sequenceTitle = this.selectedSequence.title;
    this.studentSequenceService.assignSequence(this.studentId!, this.selectedSequence!.id!).subscribe({
      next: () => {
        this.loadSequences(this.studentId!);
        localStorage.setItem('infoMessage', `Secuencia asignada correctamente a ${this.student!.user!.name}`);
        this.selectedSequence = null;
      },
      error: (error) => {
        console.error('Error al asignar secuencia:',error);
        alert('Error al asignar secuencia. Por favor, intenta de nuevo.')
      }
    });
  }

  unassignSequence(sequence: Sequence): void{
    if (!confirm(`¿Estás seguro de que quieres eliminar la secuencia "${sequence. title}"?`)) {
      return;
    }

    this.studentSequenceService.unassignSequence(this.studentId!, sequence.id!).subscribe({
      next: () => {
        this.loadSequences(this.studentId!);

        localStorage. setItem('infoMessage', `Secuencia eliminada correctamente`);
      },
      error: (error) => {
        console.error('Error al desasignar secuencia:',error);
        alert('Error al eliminar la secuencia.  Por favor, intenta de nuevo.');
      }
    });
  }

  personalizeSequence(sequence: Sequence): void {
    this.modalService.dismissAll();
    this.router. navigate(['/sequences/modify', sequence.id]);
  }

}
