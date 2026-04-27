import { Component, input, output } from '@angular/core';
import { ActionButtonsComponent } from "../../shared/action-buttons-component/action-buttons-component";
import { Router } from '@angular/router';
import { LoadingComponent } from "../../shared/loading-component/loading-component";
import { AlumnosService } from '../../../../logic/services/alumnos-service';
import { SecuenciasService } from '../../../../logic/services/secuencias-service';
import { StudentListResponse } from '../../../../logic/interfaces/alumnos-interface';
@Component({
  selector: 'app-student-row-component',
  imports: [ActionButtonsComponent, LoadingComponent],
  templateUrl: './student-row-component.html',
  styleUrl: './student-row-component.css',
})
export class StudentRowComponent {

  constructor(private router: Router, private alumnosService: AlumnosService, private secuenciasService: SecuenciasService) { }

  student = input<StudentListResponse>();
  onDelete = output<void>();
  loading: boolean = false;
  onViewDetail = output<void>();

  editStudent() {
    // Hacer un router navigate a la pagina de modificar estudiante pasandolle el ID de estudiante.
    let id = this.student()?.id;
    this.router.navigate(['/students/modify/', id]);
  }

  assignValuable() {
    let id = this.student()?.id;
    this.router.navigate(['/students/assign-valuable/', id]);
  }

  deleteStudent() {
    let id = this.student()?.id;

    if (id && confirm('¿Seguro que quieres borrar este alumno?')) {
      this.alumnosService.delete(id).subscribe({
        next: () => {
          localStorage.setItem('infoMessage', 'Alumno borrado correctamente.');
          this.onDelete.emit();
        },
        error: (err) => {
          if (err.status == 401) {
            localStorage.setItem('errorMessage', 'Sesión expirada. Por favor, inicia sesión de nuevo.');
            this.router.navigate(['/login']);
          } else {
            alert('Error al borrar el alumno: ' + err.message);
          }
        }
      });
    }
  }

  onRowClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('app-action-buttons-component')) {
      return;
    }
    this.onViewDetail.emit();
  }

}
