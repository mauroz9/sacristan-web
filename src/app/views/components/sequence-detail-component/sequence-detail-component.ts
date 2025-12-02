import { Component, OnInit } from '@angular/core';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SequenceService } from '../../../logic/services/sequence-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sequence-detail-component',
  imports: [CommonModule],
  templateUrl: './sequence-detail-component.html',
  styleUrl: './sequence-detail-component.css',
})
export class SequenceDetailComponent implements OnInit {
  sequence: Sequence | undefined;
  currentIndex: number = 0;

  constructor(private route: ActivatedRoute, private router: Router, private sequenceService: SequenceService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if(id){
      this.sequence = this.sequenceService.getSequenceById(+id);
    }
  }

  prevStep() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextStep() {
    if (this.sequence && this.currentIndex < this.sequence.steps.length - 1) {
      this.currentIndex++;
    }
  }

  goBack() {
    this.router.navigate(['/sequences']);
  }
}
