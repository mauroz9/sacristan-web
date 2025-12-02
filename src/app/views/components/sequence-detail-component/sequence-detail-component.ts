import { Component, OnInit } from '@angular/core';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SequenceService } from '../../../logic/services/sequence-service';

@Component({
  selector: 'app-sequence-detail-component',
  imports: [],
  templateUrl: './sequence-detail-component.html',
  styleUrl: './sequence-detail-component.css',
})
export class SequenceDetailComponent implements OnInit {
  sequence: Sequence | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private sequenceService: SequenceService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if(id){
      this.sequence = this.sequenceService.getSequenceById(+id);
    }
  }

  goBack() {
    this.router.navigate(['/sequences']);
  }
}
