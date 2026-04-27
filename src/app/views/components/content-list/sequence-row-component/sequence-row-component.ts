import { Component, input, output } from '@angular/core';
import { ActionButtonsComponent } from '../../shared/action-buttons-component/action-buttons-component';
import { Router } from '@angular/router';
import { SecuenciasService } from '../../../../logic/services/secuencias-service';
import { SequenceListResponse } from '../../../../logic/interfaces/secuencias-interface';

@Component({
  selector: 'app-sequence-row-component',
  imports: [ActionButtonsComponent],
  templateUrl: './sequence-row-component.html',
  styleUrl: './sequence-row-component.css',
})
export class SequenceRowComponent {

  sequence = input<SequenceListResponse>();
  onDelete = output<void>();

  constructor(private secuenciaServicio: SecuenciasService, private router: Router) {}

  deleteSequence(): void{
    const id = this.sequence()?.id;
    
    if(id && confirm('¿Seguro que quieres borrar esta secuencia?')){
      this.secuenciaServicio.delete(id).subscribe({
        next: () => {
          localStorage.setItem('infoMessage', 'Secuencia eliminada correctamente');
          this.onDelete.emit();
        },
        error: (error) => {
          alert('Error al eliminar la secuencia');
        }
      });
    }

  }

  modifySequence(): void{
    const id = this.sequence()?.id;
    if(id){
      this.router.navigate(['/sequences/modify', id]);
    }
  }

  viewSequence(){
    const id = this.sequence()?.id;
    if(id){
      this.router.navigate(['/sequences/view', id]);
    }
  }

  duplicateSequence(sequence: SequenceListResponse): void {
    if (!confirm(`¿Quieres duplicar la secuencia "${sequence.title}"?`)) {
      return;
    }

    this.secuenciaServicio.duplicate(sequence.id).subscribe({
      next: (duplicatedSequenceResponse) => {
        const newSequenceId = duplicatedSequenceResponse.id;
        
        localStorage.setItem('infoMessage', 'Secuencia duplicada correctamente');
        this.router.navigate(['/sequences/modify', newSequenceId]);
      },
      error: (error) => {
        alert('Error al duplicar la secuencia');
      }
    });
  }
}
