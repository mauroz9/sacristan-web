import { Component, input, output } from '@angular/core';
import { SequenceRowComponent } from '../sequence-row-component/sequence-row-component';
import { Content } from '../../../../logic/interfaces/content-interface';
import { StudentRowComponent } from "../student-row-component/student-row-component";
import { NewStudentModalComponent } from "../../new-student-modal-component/new-student-modal-component";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-content-list-component',
  imports: [SequenceRowComponent, StudentRowComponent, NewStudentModalComponent, RouterLink],
  templateUrl: './content-list-component.html',
  styleUrl: './content-list-component.css',
})
export class ContentListComponent{

  content = input<Content>();
  newStudent = false;

  constructor(private router: Router) {
      if (this.router.url.includes('students/new')) {       
        this.newStudent = true;
      }
  }
}
