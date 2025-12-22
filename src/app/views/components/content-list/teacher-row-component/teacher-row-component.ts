import { Component, input, OnInit, output } from '@angular/core';
import { Teacher } from '../../../../logic/interfaces/teacher-interface';
import { ActionButtonsComponent } from "../../shared/action-buttons-component/action-buttons-component";
import { TeacherService } from '../../../../logic/services/teacher-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-row-component',
  imports: [ActionButtonsComponent],
  templateUrl: './teacher-row-component.html',
  styleUrl: './teacher-row-component.css',
})
export class TeacherRowComponent implements OnInit {

  constructor(private teacherService: TeacherService, private router: Router) {}
  
  teacher = input<Teacher>();
  onDelete = output<void>();
  assignatedStudents: number = 0;

  ngOnInit(): void {
    let id = this.teacher()?.id;
    if(id){
      this.teacherService.getAssignedStudentsCount(id).subscribe({
        next: (count) => {          
          this.assignatedStudents = count;
        },
        error: (err) => {
          console.error('Error al obtener el número de estudiantes asignados: ' + err.message);
        }
      });
    }
  }

  editTeacher() {
      let id = this.teacher()?.id;
      this.router.navigate(['/teachers/modify/', id]);
  }

    assignStudent() {
      let id = this.teacher()?.id;
      this.router.navigate(['/teachers/asign-students/', id]);
    }

  deleteTeacher() {
      let id = this.teacher()?.id;
      
      if(id && confirm('¿Seguro que quieres borrar este profesor?')){
        this.teacherService.deleteTeacher(id).subscribe({
          next: () => {
            localStorage.setItem('infoMessage', 'Profesor borrado correctamente.');
            this.onDelete.emit();
          },
          error: (err) => {
            alert('Error al borrar el profesor: ' + err.message);
          }
        });
    }
  }

}
