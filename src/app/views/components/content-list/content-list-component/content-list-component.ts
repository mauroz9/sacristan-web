import { Component, input, OnInit } from '@angular/core';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
import { Content } from '../../../logic/interfaces/content-interface';
import { SequenceRowComponent } from '../sequence-row-component/sequence-row-component';

@Component({
  selector: 'app-content-list-component',
  imports: [SequenceRowComponent],
  templateUrl: './content-list-component.html',
  styleUrl: './content-list-component.css',
})
export class ContentListComponent implements OnInit {

    content = input<Content>();

    ngOnInit(): void {
      console.log(this.content()?.contentList);
    }
}
