import { Component, output } from '@angular/core';

@Component({
  selector: 'app-action-buttons-component',
  imports: [],
  templateUrl: './action-buttons-component.html',
  styleUrl: './action-buttons-component.css',
})
export class ActionButtonsComponent {
  onDelete = output<void>();
  onEdit = output<void>();
}
