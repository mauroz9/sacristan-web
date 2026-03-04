import { Component, input, output } from '@angular/core';
import { Routine } from '../../../../logic/interfaces/routine-interface';
import { RoutineService } from '../../../../logic/services/routine-service';
import { Router } from '@angular/router';
import { ActionButtonsComponent } from "../../shared/action-buttons-component/action-buttons-component";

@Component({
  selector: 'app-routine-row-component',
  imports: [ActionButtonsComponent],
  templateUrl: './routine-row-component.html',
  styleUrl: './routine-row-component.css',
})
export class RoutineRowComponent {
  routine = input<Routine>();
  onDelete = output<void>();

  constructor(private routineService: RoutineService, private router: Router) {}

  deleteRoutine(): void {
    const id = this.routine()?.id;

    if(id && confirm('¿Seguro que quieres borrar esta rutina?')){
      this.routineService.deleteRoutine(id).subscribe({
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

  viewRoutine() {
    const id = this.routine()?.id;
    if(id){
      this.router.navigate(['/routines/view', id]);
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
