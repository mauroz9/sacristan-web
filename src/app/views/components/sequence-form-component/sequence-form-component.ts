import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
import { Router, RouterLink } from '@angular/router';
import { StepModalComponent } from '../step-modal-component/step-modal-component';

@Component({
  selector: 'app-sequence-form-component',
  imports: [ReactiveFormsModule, RouterLink, StepModalComponent],
  templateUrl: './sequence-form-component.html',
  styleUrl: './sequence-form-component.css',
})
export class SequenceFormComponent {
  
  sequenceForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    steps: new FormArray([])
  });

  showModal = false;

  constructor(private router: Router) {}

  get steps(): FormArray {
    return this.sequenceForm.get('steps') as FormArray;
  }

  openModal(): void{
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  handleSaveStep(step: {name: string, imageUrl: string}): void{
    const newStep = new FormGroup({
      description: new FormControl(step.name),
      imageUrl: new FormControl(step.imageUrl)
    });

    this.steps.push(newStep);
    this.showModal = false;
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  onSubmit(){
    if(this.sequenceForm.valid){
      console.log(this.sequenceForm.value);
      this.router.navigate(["/sequences"]);
    }
  }
}
