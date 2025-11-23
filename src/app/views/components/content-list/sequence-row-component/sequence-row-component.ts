import { Component, input, output } from '@angular/core';
import { ActionButtonsComponent } from '../../shared/action-buttons-component/action-buttons-component';
import { Sequence } from '../../../../logic/interfaces/sequence-interface';
import { SequenceService } from '../../../../logic/services/sequence-service';

@Component({
  selector: 'app-sequence-row-component',
  imports: [ActionButtonsComponent],
  templateUrl: './sequence-row-component.html',
  styleUrl: './sequence-row-component.css',
})
export class SequenceRowComponent {

  sequence = input<Sequence>();

  constructor(private sequenceService: SequenceService) {}

  deleteSequence(): void{
    const id = this.sequence()?.id;
    
    if(id && confirm('¿Seguro que quieres borrar esta secuencia?')){
      this.sequenceService.deleteSequence(id);
    }

  }
}
