import { Component, OnInit, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-action-buttons-component',
  imports: [],
  templateUrl: './action-buttons-component.html',
  styleUrl: './action-buttons-component.css',
})
export class ActionButtonsComponent implements OnInit {
  
  isStudent = false;
  isSequence = false;
  
  onDelete = output<void>();
  onEdit = output<void>();
  onAssignSequences = output<void>();
  onView = output<void>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.router.url.includes('/students')) {
      this.isStudent = true;
    } else if (this.router.url.includes('/sequences')) {
      this.isSequence = true;
    }
  }
  

}
