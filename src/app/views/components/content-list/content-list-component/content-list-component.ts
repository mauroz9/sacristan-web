import { Component, input, output } from '@angular/core';
import { SequenceRowComponent } from '../sequence-row-component/sequence-row-component';
import { Content } from '../../../../logic/interfaces/content-interface';
import { StudentRowComponent } from "../student-row-component/student-row-component";
import { NewStudentModalComponent } from "../../form-modal-component/form-modal-component";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-content-list-component',
  imports: [SequenceRowComponent, StudentRowComponent, NewStudentModalComponent, RouterLink],
  templateUrl: './content-list-component.html',
  styleUrl: './content-list-component.css',
})
export class ContentListComponent{

  content = input<Content>();
  functionality = "";

  constructor(private router: Router) {
      if (this.router.url.includes('students/new')) {       
        this.functionality = "newStudent";
      } else if (this.router.url.includes('students/modify')) {
        this.functionality = "modifyStudent";
      }
  }
}
