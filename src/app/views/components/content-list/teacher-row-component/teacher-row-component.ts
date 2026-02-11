import { Component, input, OnInit, output } from '@angular/core';
import { Teacher } from '../../../../logic/interfaces/teacher-interface';
import { ActionButtonsComponent } from "../../shared/action-buttons-component/action-buttons-component";
import { TeacherService } from '../../../../logic/services/teacher-service';
import { Router } from '@angular/router';
import { LoadingComponent } from "../../shared/loading-component/loading-component";
import { TeacherResponse } from '../../../../logic/interfaces/user/teacher/teacher-interface';

@Component({
  selector: 'app-teacher-row-component',
  imports: [ActionButtonsComponent, LoadingComponent],
  templateUrl: './teacher-row-component.html',
  styleUrl: './teacher-row-component.css',
})
export class TeacherRowComponent implements OnInit {

  constructor(private teacherService: TeacherService, private router: Router) {}
  
  teacher = input<TeacherResponse>();
  onDelete = output<void>();
  assignatedStudents: number = 0;
  loading: boolean = false;

  ngOnInit(): void {
    this.loading = true;
    let id = this.teacher()?.id;
    if(id){
      this.teacherService.getStudentCountByTeacher(id).subscribe({
        next: (count) => {          
          this.assignatedStudents = count;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al obtener el número de estudiantes asignados: ' + err.message);
          this.loading = false;
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
      this.router.navigate(['/teachers/assign-students/', id]);
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
            console.log('Error al borrar el profesor: ');
            console.log(err);            

            if(err.error.es){              
              let errorMessage = 'Error al borrar el profesor: ' + err.error.es.message;
              localStorage.setItem('errorMessage', errorMessage);
              window.location.reload();
            }

          }
        });
    }
  }

}
