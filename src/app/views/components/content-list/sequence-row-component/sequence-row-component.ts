import { Component, input } from '@angular/core';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
import { ActionButtonsComponent } from "../shared/action-buttons-component/action-buttons-component";

@Component({
  selector: 'app-sequence-row-component',
  imports: [ActionButtonsComponent],
  templateUrl: './sequence-row-component.html',
  styleUrl: './sequence-row-component.css',
})
export class SequenceRowComponent {

  sequence = input<Sequence>();

}
