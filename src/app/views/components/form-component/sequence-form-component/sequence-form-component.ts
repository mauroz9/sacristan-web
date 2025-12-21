import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StepModalComponent } from '../../step-modal-component/step-modal-component';
import { SequenceService } from '../../../../logic/services/sequence-service';
import { Sequence } from '../../../../logic/interfaces/sequence-interface';
@Component({
  selector: 'app-sequence-form-component',
  imports: [ReactiveFormsModule, StepModalComponent, RouterLink],
  templateUrl: './sequence-form-component.html',
  styleUrl: './sequence-form-component.css',
})
export class SequenceFormComponent implements OnInit{
  
  sequenceForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category_id: new FormControl<number | null>(null , Validators.required),
    steps: new FormArray([])
  });
  
  draggedIndex: number | null = null;
  showModal = false;
  isEditMode = false;
  sequenceId: number | null = null;
  editingStepIndex: number | null = null;
  stepToEdit: {description: string, imageUrl: string} | null = null;

  constructor(private router: Router, private sequenceService: SequenceService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      const id = this.route.snapshot.paramMap.get('id');

      if(id){
        this.isEditMode = true;
        this.sequenceId = Number(id);
        this.loadSequenceData(this.sequenceId);
      }
  }

  loadSequenceData(id: number): void{
    this.sequenceService.getSequenceById(id).subscribe({
      next: (sequence) => {
        if (sequence) {
          this.sequenceForm.patchValue({
            title: sequence.title,
            description: sequence.description,
            category_id: sequence.sequence_category_id 
          });

          this.steps.clear();
          if (sequence.steps) {
            sequence.steps.forEach(step => {
              this.addStepToForm({ 
                description: step.description,
                imageUrl: step.imageUrl 
              });
            });
          }
        }
      },
    });
  }

  addStepToForm(step: {description: string, imageUrl: string}): void{
    const newStep = new FormGroup({
      description: new FormControl(step.description),
      imageUrl: new FormControl(step.imageUrl)
    });
    this.steps.push(newStep);
  }

  //Steps logic
  get steps(): FormArray {
    return this.sequenceForm.get('steps') as FormArray;
  }

  openModal(): void{
    this.editingStepIndex = null;
    this.stepToEdit = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingStepIndex = null;
    this.stepToEdit = null;
  }

  handleSaveStep(step: {name: string, imageUrl: string}): void{
    if(this.editingStepIndex !== null){
      const stepControl = this.steps.at(this.editingStepIndex) as FormGroup;
      stepControl.patchValue({
        description: step.name,
        imageUrl: step.imageUrl
      });
    }else{
      this.addStepToForm({ description: step.name, imageUrl: step.imageUrl});
    }
    this.showModal = false;
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  modifyStep(index: number): void{
    const stepMod = this.steps.at(index) as FormGroup;
    this.editingStepIndex = index;
    this.stepToEdit = {
      description: stepMod.get('description')?.value,
      imageUrl: stepMod.get('imageUrl')?.value
    }

    this.showModal = true;
  }

  //Move Steps
  onDragStart(index: number): void {
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
    
  moveStep(fromIndex: number, toIndex: number): void{
    const stepControl = this.steps.at(fromIndex);
    this.steps.removeAt(fromIndex);
    this.steps.insert(toIndex, stepControl);
  }

  onDrop(dropIndex: number): void {
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
        id: this.isEditMode ? (this.sequenceId ?? 0) : 0,
        title: formValue.title!,
        description: formValue.description!,
        category_id: formValue.category_id!,
        steps: (formValue.steps as any[]).map((step, index) => ({
          id: index + 1,
          order: index + 1,
          description: step.description,
          imageUrl: step.imageUrl
        }))
      };
      if(this.isEditMode){
        this.sequenceService.modifySequence(newSequence);
      }else{
        this.sequenceService.addSequence(newSequence);
      }
      this.router.navigate(["/sequences"]);
    } else {
      this.sequenceForm.markAllAsTouched();
    }
  }
}
