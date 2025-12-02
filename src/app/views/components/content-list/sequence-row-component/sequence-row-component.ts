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

  constructor(private sequenceService: SequenceService, private router: Router) {}

  deleteSequence(): void{
    const id = this.sequence()?.id;
    
    if(id && confirm('¿Seguro que quieres borrar esta secuencia?')){
      this.sequenceService.deleteSequence(id);
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
}
