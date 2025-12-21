import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StepModalComponent } from '../../step-modal-component/step-modal-component';
import { SequenceService } from '../../../../logic/services/sequence-service';
import { Sequence } from '../../../../logic/interfaces/sequence-interface';
import { CategorySequenceService } from '../../../../logic/services/category-sequence-service';
import { Category } from '../../../../logic/interfaces/category-sequence-interface';
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
  stepToEdit: {title: string, imageUrl: string} | null = null;
  categories: Category[] = [];

  constructor(private router: Router, private sequenceService: SequenceService, private route: ActivatedRoute, private categorySequenceService: CategorySequenceService) {}

  ngOnInit(): void {

    this.categorySequenceService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
        }
      });

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
                title: step.title,
                imageUrl: step.pictogram_arasaac 
              });
            });
          }
        }
      },
    });
  }

  addStepToForm(step: {title: string, imageUrl: string | null}): void{
    const newStep = new FormGroup({
      title: new FormControl(step.title),
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
      this.addStepToForm({ title: step.name, imageUrl: step.imageUrl});
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
      title: stepMod.get('description')?.value,
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
    this.categorySequenceService.getCategoryById(formValue.category_id!).subscribe({
      next: (category) => {
        const newSequence: Sequence = {
          kind: 'secuencia',
          id: this.isEditMode ? (this.sequenceId ?? 0) : 0,
          title: formValue.title!,
          description: formValue.description!,
          sequence_category_id: formValue.category_id!,
          steps: (formValue.steps as any[]).map((step, index) => ({
            id: this.isEditMode ? (step.id ?? index + 1) : index + 1,
            sequence_id: this.isEditMode ? (this.sequenceId ?? 0) : 0,
            position: index + 1,
            title: step.title,
            pictogram_arasaac: step.imageUrl,
            pictogram_custom: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: category
        };

        if(this.isEditMode){
          this.sequenceService.modifySequence(newSequence).subscribe({
            next: () => {
              localStorage.setItem('infoMessage', 'Secuencia modificada correctamente');
              this.router.navigate(["/sequences"]);
            },
            error: (error) => {
              console.error('Error al modificar la secuencia:', error);
            }
          });
        }else{
          this.sequenceService.addSequence(newSequence).subscribe({
            next: () => {
              localStorage.setItem('infoMessage', 'Secuencia creada correctamente');
              this.router.navigate(["/sequences"]);
            },
            error: (error) => {
              console.error('Error al crear la secuencia:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error al obtener la categoría:', error);
      }
    });
  } else {
    this.sequenceForm.markAllAsTouched();
  }
}
}
