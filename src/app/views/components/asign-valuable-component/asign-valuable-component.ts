import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from "../shared/loading-component/loading-component";
import { AlumnosService } from '../../../logic/services/alumnos-service';
import { ProfesoresService } from '../../../logic/services/profesores-service';
import { RoutineListResponse } from '../../../logic/interfaces/rutinas-interface';
import { SequenceListResponse } from '../../../logic/interfaces/secuencias-interface';
import { RoutineResponse, SequenceResponse, StudentListResponse } from '../../../logic/interfaces/alumnos-interface';
import { ReadUserResponse } from '../../../logic/interfaces/extras/users-interface';

@Component({
  selector: 'app-asign-valuable-component',
  imports: [RouterLink, CommonModule, FormsModule, LoadingComponent],
  templateUrl: './asign-valuable-component.html',
  styleUrl: './asign-valuable-component.css',
})
export class AsignSequencesComponent implements AfterViewInit {

  @ViewChild('modal') modal!: TemplateRef<any>;

  student: ReadUserResponse | null = null;
  studentId: number | null = null;
  sequences: SequenceListResponse[] = [];
  assignedSequences: SequenceResponse[] = [];
  availableSequences: SequenceResponse[] = [];
  assignedRoutines: RoutineResponse[] = [];
  availableRoutines: RoutineResponse[] = [];
  loading: boolean = false;
  loadingSequences: boolean = false;
  loadingRoutines: boolean = false;

  routineSearchTerm: string = '';
  sequenceSearchTerm: string = '';
  filteredAvailableRoutines: RoutineResponse[] = [];
  filteredAvailableSequences: SequenceResponse[] = [];

  filterRoutines(): void {
    if (!this.routineSearchTerm.trim()) {
      this.filteredAvailableRoutines = this.availableRoutines;
      return;
    }
    const term = this.routineSearchTerm.toLowerCase().trim();
    this.filteredAvailableRoutines = this.availableRoutines.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.category?.toLowerCase().includes(term)
    );
  }

  filterSequences(): void {
    if (!this.sequenceSearchTerm.trim()) {
      this.filteredAvailableSequences = this.availableSequences;
      return;
    }
    const term = this.sequenceSearchTerm.toLowerCase().trim();
    this.filteredAvailableSequences = this.availableSequences.filter(s =>
      s.title.toLowerCase().includes(term) ||
      s.category?.toLowerCase().includes(term)
    );
  }
  
  
  constructor(private modalService: NgbModal, 
    private router: Router, private route: ActivatedRoute, 
    private alumnoService: AlumnosService
  ) { }

  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent, { centered: true, backdrop: 'static', keyboard: false, size: 'lg' });
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.openModal(this.modal);
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.studentId = Number(id);
      this.loadStudentData(this.studentId);
      this.loadingSequences = true;
      this.loadSequences(this.studentId);
    
      this.loadingRoutines = true;
      this.loadRoutines(this.studentId);
    }
  }

  loadStudentData(studentId: number): void {
    this.alumnoService.read(studentId).subscribe({
      next: (data) => {
        this.student = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estudiante', error);
      }
    });
  }

  loadRoutines(studentId: number): void {
    this.alumnoService.getUnassignedRoutines(studentId).subscribe({
      next: (data) => {
        this.availableRoutines = data;
        this.filterRoutines();
        this.loadingRoutines = false;
      },
      error: (error) => {
        console.error('Error al cargar secuencias disponibles:', error);
      }
    });

    this.alumnoService.getAssignedRoutines(studentId).subscribe({
      next: (data) => {
        this.assignedRoutines = data;
      },
      error: (error) => {
        console.error("Error al cargar secuencias asignadas:", error);
      }
    });
  }

  assignRoutine(routine: RoutineResponse): void {
    if (!routine || !this.student) {
      return;
    }

    this.alumnoService.assignRoutineToStudent(this.studentId!, routine.id!).subscribe({
      next: () => {
        this.loadingRoutines = true;
        this.loadRoutines(this.studentId!);
      },
      error: (error) => {
        console.error('Error al asignar secuencia:', error);
        alert('Error al asignar secuencia. Por favor, intenta de nuevo.')
      }
    });
  }

  unassignRoutine(routine: RoutineResponse): void {
    this.alumnoService.unassignRoutineFromStudent(this.studentId!, routine.id!).subscribe({
      next: () => {
        this.loadRoutines(this.studentId!);

      },
      error: (error) => {
        console.error('Error al desasignar secuencia:', error);
        alert('Error al eliminar la secuencia.  Por favor, intenta de nuevo.');
      }
    });
  }

  loadSequences(studentId: number): void {
    this.alumnoService.getUnassignedSequences(studentId).subscribe({
      next: (data) => {
        this.availableSequences = data;
        this.filterSequences();
        this.loadingSequences = false;
      },
      error: (error) => {
        console.error('Error al cargar secuencias disponibles:', error);
      }
    });

    this.alumnoService.getAssignedSequences(studentId).subscribe({
      next: (data) => {
        this.assignedSequences = data;
      },
      error: (error) => {
        console.error("Error al cargar secuencias asignadas:", error);
      }
    });
  }

  assignSequence(seq: SequenceResponse): void {
    if (!seq || !this.student) {
      return;
    }

    this.alumnoService.assignSequenceToStudent(this.studentId!, seq.id!).subscribe({
      next: () => {
        this.loadingSequences = true;
        this.loadSequences(this.studentId!);
      },
      error: (error) => {
        console.error('Error al asignar secuencia:', error);
        alert('Error al asignar secuencia. Por favor, intenta de nuevo.')
      }
    });
  }

  unassignSequence(sequence: SequenceResponse): void {
    this.alumnoService.unassignSequenceFromStudent(this.studentId!, sequence.id!).subscribe({
      next: () => {
        this.loadSequences(this.studentId!);

      },
      error: (error) => {
        console.error('Error al desasignar secuencia:', error);
        alert('Error al eliminar la secuencia.  Por favor, intenta de nuevo.');
      }
    });
  }

  // personalizeSequence(sequence: Sequence): void {
  //   const studentName = this.student?.name || 'este alumno';

  //   if (!confirm(`¿Quieres crear una versión personalizada de "${sequence.title}" para ${studentName}?\n\nSe desasignará la secuencia original y se creará una copia que podrás modificar.`)) {
  //     return;
  //   }

  //   this.loadingSequences = true;

  //   this.sequenceService.duplicateSequence(sequence.id).subscribe({
  //     next: (newSequence) => {
  //       const newSequenceId = newSequence.id;

  //       this.studentSequenceService.unassignSequence(this.studentId!, sequence.id).subscribe({
  //         next: () => {
  //           this.studentSequenceService.assignSequence(this.studentId!, newSequenceId).subscribe({
  //             next: () => {
  //               localStorage.setItem('infoMessage', `Secuencia personalizada creada correctamente para ${studentName}`);
  //               this.modalService.dismissAll();
  //               this.router.navigate(['/sequences/modify', newSequenceId]);
  //             },
  //             error: (error) => {
  //               console.error('Error al asignar la secuencia duplicada:', error);
  //               alert('La secuencia se duplicó pero hubo un error al asignarla');
  //               this.loadingSequences = false;
  //             }
  //           });
  //         },
  //         error: (error) => {
  //           console.error('Error al desasignar la secuencia original:', error);
  //           alert('La secuencia se duplicó pero hubo un error al desasignar la original');
  //           this.loadingSequences = false;
  //         }
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error al duplicar la secuencia:', error);
  //       alert('Error al crear la secuencia personalizada');
  //       this.loadingSequences = false;
  //     }
  //   });
  // }

  switchTab(actualTab: string): void {

    const btnRutinas = document.getElementById('btn-rutinas');
    const btnSecuencias = document.getElementById('btn-secuencias');
    const contentRutinas = document.getElementById('content-rutinas');
    const contentSecuencias = document.getElementById('content-secuencias');


    if (actualTab == 'secuencias') {
      btnSecuencias!.className = 'btn btn-primary rounded-pill flex-fill fw-semibold tab-active';
      btnRutinas!.className = 'btn text-secondary rounded-pill flex-fill fw-semibold tab-inactive';
      
      contentSecuencias!.classList.remove('d-none');
      contentRutinas!.classList.add('d-none');
    } else if (actualTab == 'rutinas') {

      btnRutinas!.className = 'btn btn-primary rounded-pill flex-fill fw-semibold tab-active';
      btnSecuencias!.className = 'btn text-secondary rounded-pill flex-fill fw-semibold tab-inactive';
      
      contentRutinas!.classList.remove('d-none');
      contentSecuencias!.classList.add('d-none');
    } else {
      alert('Error: pestaña desconocida');
    }

  }

}
