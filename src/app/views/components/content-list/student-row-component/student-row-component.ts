import { Component, input, OnInit, output } from '@angular/core';
import { Student } from '../../../../logic/interfaces/student-interface';
import { ActionButtonsComponent } from "../../shared/action-buttons-component/action-buttons-component";
import { Router } from '@angular/router';
import { StudentService } from '../../../../logic/services/student-service';
import { StudentSequenceService } from '../../../../logic/services/student-sequence-service';
@Component({
  selector: 'app-student-row-component',
  imports: [ActionButtonsComponent],
  templateUrl: './student-row-component.html',
  styleUrl: './student-row-component.css',
})
export class StudentRowComponent implements OnInit {

  constructor(private router: Router, private studentService: StudentService, private studentSequenceService: StudentSequenceService) { }

  student = input<Student>();
  onDelete = output<void>();
  loading: boolean = false;

  sequenceCount: number | null = null;

  editStudent() {
    // Hacer un router navigate a la pagina de modificar estudiante pasandolle el ID de estudiante.
    let id = this.student()?.user!.id;
    this.router.navigate(['/students/modify/', id]);
  }

  ngOnInit(): void {
    this.loading = true;
    if (this.student()?.id) {
      this.loadSequenceCount();
    }
  }

  loadSequenceCount(): void {
    this.studentSequenceService.getStudentSequences(this.student()!.id!).subscribe({
      next: (sequences) => {
        this.sequenceCount = sequences.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar el conteo de secuencias:', error);
        this.sequenceCount = 0;
      }
    });
  }

  assignSequences() {
    let id = this.student()?.id;
    this.router.navigate(['/students/asign-sequences/', id]);
  }

  deleteStudent() {
    let id = this.student()?.id;

    if (id && confirm('¿Seguro que quieres borrar este alumno?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          localStorage.setItem('infoMessage', 'Alumno borrado correctamente.');
          this.onDelete.emit();
        },
        error: (err) => {
          alert('Error al borrar el alumno: ' + err.message);
        }
      });
    }
  }

}
