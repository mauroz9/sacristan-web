import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    if (id) {
      this.sequenceService.getSequenceById(+id).subscribe(req => {
        this.sequence = req;
      });
    }
  }

  // Centralizamos la navegación
  goToStep(index: number) {
    this.currentIndex = index;
    this.centerScroll(index);
  }

  nextStep() {
    if (this.sequence && this.currentIndex < this.sequence.steps.length - 1) {
      this.currentIndex++;
      this.centerScroll(this.currentIndex);
    }
  }

  prevStep() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.centerScroll(this.currentIndex);
    }
  }

  private centerScroll(index: number) {
    setTimeout(() => {
      const element = document.getElementById(`step-${index}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }, 50);
  }

  goBack() { this.router.navigate(['/sequences']); }
  goEdit() { if (this.sequence) this.router.navigate(['/sequences/modify', this.sequence.id]); }
}