import { Component, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { ActionButtonsComponent } from "../../shared/action-buttons-component/action-buttons-component";
import { RutinasService } from '../../../../logic/services/rutinas-service';
import { RoutineListResponse } from '../../../../logic/interfaces/rutinas-interface';

@Component({
  selector: 'app-routine-row-component',
  imports: [ActionButtonsComponent],
  templateUrl: './routine-row-component.html',
  styleUrl: './routine-row-component.css',
})
export class RoutineRowComponent {
  routine = input<RoutineListResponse>();
  onDelete = output<void>();

  constructor(private rutinasService: RutinasService, private router: Router) {}

  deleteRoutine(): void {
    const id = this.routine()?.id;

    if(id && confirm('¿Seguro que quieres borrar esta rutina?')){
      this.rutinasService.delete(id).subscribe({
        next: () => {
          localStorage.setItem('infoMessage', 'Rutina eliminada correctamente');
          this.onDelete.emit();
        },
        error: (error) => {
          console.error('Error al eliminar la rutina:', error);
          alert('Error al eliminar la rutina');
        }
      });
    }
  }

  modifyRoutine(): void {
    const id = this.routine()?.id;
    if(id){
      this.router.navigate(['/routines/modify', id]);
    }
  }
  
  formatDays(days: string[] | undefined): string {
    if (!days || days.length === 0) return 'Sin días asignados';
    const dayMap: { [key: string]: string } = {
      'MONDAY': 'Lun', 'TUESDAY': 'Mar', 'WEDNESDAY': 'Mié', 
      'THURSDAY': 'Jue', 'FRIDAY': 'Vie', 'SATURDAY': 'Sáb', 'SUNDAY': 'Dom'
    };
    return days.map(d => dayMap[d] || d).join(', ');
  }
}
