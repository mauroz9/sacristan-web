import { Component, input, output } from '@angular/core';
import { ActionButtonsComponent } from "../../shared/action-buttons-component/action-buttons-component";
import { Router } from '@angular/router';
import { LoadingComponent } from "../../shared/loading-component/loading-component";
import { ProfesoresService } from '../../../../logic/services/profesores-service';
import { TeacherListResponse } from '../../../../logic/interfaces/profesores-interface';

@Component({
  selector: 'app-teacher-row-component',
  imports: [ActionButtonsComponent, LoadingComponent],
  templateUrl: './teacher-row-component.html',
  styleUrl: './teacher-row-component.css',
})
export class TeacherRowComponent {

  constructor(private profesoresService: ProfesoresService, private router: Router) {}
  
  teacher = input<TeacherListResponse>();
  onDelete = output<void>();

  loading: boolean = false;

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
        this.profesoresService.delete(id).subscribe({
          next: () => {
            localStorage.setItem('infoMessage', 'Profesor borrado correctamente.');
            this.onDelete.emit();
          },
          error: (err) => {
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
