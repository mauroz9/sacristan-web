import { Component, input, output } from '@angular/core';
import { ActionButtonsComponent } from '../../shared/action-buttons-component/action-buttons-component';
import { Sequence } from '../../../../logic/interfaces/sequence-interface';
import { SequenceService } from '../../../../logic/services/sequence-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sequence-row-component',
  imports: [ActionButtonsComponent],
  templateUrl: './sequence-row-component.html',
  styleUrl: './sequence-row-component.css',
})
export class SequenceRowComponent {

  sequence = input<Sequence>();
  onDelete = output<void>();

  constructor(private sequenceService: SequenceService, private router: Router) {}

  deleteSequence(): void{
    const id = this.sequence()?.id;
    
    if(id && confirm('¿Seguro que quieres borrar esta secuencia?')){
      this.sequenceService.deleteSequence(id).subscribe({
        next: () => {
          localStorage.setItem('infoMessage', 'Secuencia eliminada correctamente');
          this.onDelete.emit();
        },
        error: (error) => {
          console.error('Error al eliminar la secuencia:', error);
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

  duplicateSequence(sequence: Sequence): void {
    if (!confirm(`¿Quieres duplicar la secuencia "${sequence.title}"?`)) {
      return;
    }

    this.sequenceService.duplicateSequence(sequence.id).subscribe({
      next: (duplicateResponse) => {
        const newSequenceId = duplicateResponse.sequence.id;
        localStorage.setItem('infoMessage', 'Secuencia duplicada correctamente');
        this.router.navigate(['/sequences/modify', newSequenceId]);
      },
      error: (error) => {
        console.error('Error al duplicar la secuencia:', error);
        alert('Error al duplicar la secuencia');
      }
    });
  }
}
