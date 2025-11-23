import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
import { Router, RouterLink } from '@angular/router';
import { StepModalComponent } from '../step-modal-component/step-modal-component';
import { SequenceService } from '../../../logic/services/sequence-service';

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

  constructor(private router: Router, private sequenceService: SequenceService) {}

  //Steps logic
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
      
      const formValue = this.sequenceForm.value;
      const newSequence: Sequence = {
        kind: 'secuencia',
        id: 0,
        title: formValue.title!,
        description: formValue.description!,
        categorie: formValue.category!,
        steps: (formValue.steps as any[]).map((step, index) => ({
          id: index + 1,
          order: index + 1,
          description: step.description,
          imageUrl: step.imageUrl
        }))
      };
      this.sequenceService.addSequence(newSequence);
      this.router.navigate(["/sequences"]);
    } else {
      this.sequenceForm.markAllAsTouched();
    }
  }
}
