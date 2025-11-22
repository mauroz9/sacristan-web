import { Component, input } from '@angular/core';
import { Student } from '../../../../logic/interfaces/student-interface';
import { ActionButtonsComponent } from "../../shared/action-buttons-component/action-buttons-component";
@Component({
  selector: 'app-student-row-component',
  imports: [ActionButtonsComponent],
  templateUrl: './student-row-component.html',
  styleUrl: './student-row-component.css',
})
export class StudentRowComponent {

    student = input<Student>();

}
