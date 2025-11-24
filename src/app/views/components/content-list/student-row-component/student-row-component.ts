import { Component, input } from '@angular/core';
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

    editStudent(idStudent: number | undefined) {
        // Hacer un router navigate a la pagina de modificar estudiante pasandolle el ID de estudiante.
      this.router.navigate(['/students/modify/', idStudent]);
    }

    assignSequences(idStudent: number | undefined) {
      this.router.navigate(['/students/asign-sequences/', idStudent]);
    }

    deleteStudent() {
      let id = this.student()?.id;
      if(id && confirm('¿Seguro que quieres borrar este alumno?')){
        this.studentService.deleteStudent(id);
    }}

}
