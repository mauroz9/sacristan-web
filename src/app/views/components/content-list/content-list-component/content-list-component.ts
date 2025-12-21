import { Component, input, output } from '@angular/core';
import { SequenceRowComponent } from '../sequence-row-component/sequence-row-component';
import { Content } from '../../../../logic/interfaces/content-interface';
import { StudentRowComponent } from "../student-row-component/student-row-component";
import { Router, RouterLink } from '@angular/router';
import { NewStudentModalComponent } from '../../form-component/student-form-modal-component/student-form-modal-component';
import { AsignSequencesComponent } from "../../asign-sequences-component/asign-sequences-component";

@Component({
  selector: 'app-content-list-component',
  imports: [SequenceRowComponent, StudentRowComponent, NewStudentModalComponent, RouterLink, AsignSequencesComponent],
  templateUrl: './content-list-component.html',
  styleUrl: './content-list-component.css',
})
export class ContentListComponent {

  content = input<Content>();
  reload = output<void>();
  functionality = "";

  constructor(private router: Router) {   
      console.log(this.content());
      
      if (this.router.url.includes('students/new')) {       
        this.functionality = "newStudent";
      } else if (this.router.url.includes('students/modify')) {
        this.functionality = "modifyStudent";
      } else if (this.router.url.includes('students/asign-sequences')) {
        this.functionality = "assignSequences";
      }      
  }

  reloadContent() {
    this.reload.emit();
  }

}
