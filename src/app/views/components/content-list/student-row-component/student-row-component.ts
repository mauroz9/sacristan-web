import { Component, input, OnChanges, output } from '@angular/core';
import { Student } from '../../../../logic/interfaces/student-interface';
import { ActionButtonsComponent } from "../../shared/action-buttons-component/action-buttons-component";
import { Router } from '@angular/router';
import { StudentService } from '../../../../logic/services/student-service';
@Component({
  selector: 'app-student-row-component',
  imports: [ActionButtonsComponent],
  templateUrl: './student-row-component.html',
  styleUrl: './student-row-component.css',
})
export class StudentRowComponent {

    constructor(private router: Router, private studentService: StudentService) {}

    student = input<Student>();
    onDelete = output<void>();

    editStudent() {
        // Hacer un router navigate a la pagina de modificar estudiante pasandolle el ID de estudiante.
      let id = this.student()?.user!.id;
      this.router.navigate(['/students/modify/', id]);
    }

    assignSequences() {
      let id = this.student()?.id;
      this.router.navigate(['/students/asign-sequences/', id]);
    }

    deleteStudent() {
      let id = this.student()?.id;

      if(id && confirm('¿Seguro que quieres borrar este alumno?')){
        this.studentService.deleteStudent(id).subscribe({
          next: () => {
            localStorage.setItem('infoMessage', 'Alumno borrado correctamente.');
            this.onDelete.emit();
          },
          error: (err) => {
            alert('Error al borrar el alumno: ' + err.message);
          }
        });
    }}

}
