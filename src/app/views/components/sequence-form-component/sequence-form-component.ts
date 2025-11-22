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
  
  draggedIndex: number | null = null;
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

  //Move Steps
  onDragStart(index: number) {
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
    
  moveStep(fromIndex: number, toIndex: number) {
    const stepControl = this.steps.at(fromIndex);
    this.steps.removeAt(fromIndex);
    this.steps.insert(toIndex, stepControl);
  }

  onDrop(dropIndex: number) {
    if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
      this.moveStep(this.draggedIndex, dropIndex);
    }
    this.draggedIndex = null;
  }

  //Save sequence
  onSubmit(){
    if(this.sequenceForm.valid){
      console.log(this.sequenceForm.value);
      this.router.navigate(["/sequences"]);
    }else{
      this.sequenceForm.markAllAsTouched();
    }
  }
}
