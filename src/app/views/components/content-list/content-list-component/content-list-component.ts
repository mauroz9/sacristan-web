import { Component, input } from '@angular/core';
import { SequenceRowComponent } from '../sequence-row-component/sequence-row-component';
import { Content } from '../../../../logic/interfaces/content-interface';
import { StudentRowComponent } from "../student-row-component/student-row-component";
import { RouterLinkActive, RouterLink } from "@angular/router";

@Component({
  selector: 'app-content-list-component',
  imports: [SequenceRowComponent, StudentRowComponent, RouterLink],
  templateUrl: './content-list-component.html',
  styleUrl: './content-list-component.css',
})
export class ContentListComponent {

    content = input<Content>();

}
