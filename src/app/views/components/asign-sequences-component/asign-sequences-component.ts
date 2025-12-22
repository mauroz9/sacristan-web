import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../../logic/services/student-service';
import { Student } from '../../../logic/interfaces/student-interface';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
import { SequenceService } from '../../../logic/services/sequence-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-asign-sequences-component',
  imports: [RouterLink],
  templateUrl: './asign-sequences-component.html',
  styleUrl: './asign-sequences-component.css',
})
export class AsignSequencesComponent implements AfterViewInit {

  @ViewChild('modal') modal!: TemplateRef<any>;

  student: Student | null = null;
  sequences: Sequence[] = [];
  assignedSequences: Sequence[] = [];
  availableSequences: Sequence[] = [];
  selectedSequence: Sequence | null = null;

  constructor(private modalService: NgbModal, private router: Router, private studentService: StudentService, private route: ActivatedRoute, private sequenceService: SequenceService) { }

  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent, { centered: true, backdrop: 'static', keyboard: false });
  }

  ngAfterViewInit(): void {
    this.openModal(this.modal);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const studentId = Number(id);
      this.studentService.getStudentById(studentId).subscribe(data => {
        this.student = data;
        this.loadData(studentId);
      });
    }
  }

  loadData(studentId: number){
    forkJoin({
      student: this.studentService.getStudentById(studentId),
      sequences: this.sequenceService.getSequences(),
      assignedSequences: this.studentService.getStudentSequences(studentId),
    }).subscribe(({student, sequences, assignedSequences}) => {
      this.student = student;
      this.sequences = sequences;
      this.assignedSequences = assignedSequences;

      this.updateAvailableSequences();
    });
  }

  updateAvailableSequences() {
    const assignedIds = this.assignedSequences.map(s => s.id);
    this.availableSequences = this.sequences.filter(s => !assignedIds.includes(s.id));
    this.selectedSequence = null;
  }

  selectSequence(seq: Sequence){
    this.selectedSequence = seq;
  }

  assign() {
    if (!this.student || !this.selectedSequence) return;

    this.studentService.assignSequence(this.student.user.id, this.selectedSequence.id).subscribe({
      next: () => {
        this.assignedSequences.push(this.selectedSequence!);
        this.updateAvailableSequences();
      },
      error: (err) => console.error('Error asignando', err)
    });
  }

  unassign(seq: Sequence) {
    if (!this.student) return;
    
    if(confirm('¿Quieres quitar esta secuencia al alumno?')) {
        this.studentService.unassignSequence(this.student.user.id, seq.id).subscribe({
            next: () => {
                this.assignedSequences = this.assignedSequences.filter(s => s.id !== seq.id);
                this.updateAvailableSequences();
            },
            error: (err) => console.error('Error desasignando', err)
        });
    }
  }

}
