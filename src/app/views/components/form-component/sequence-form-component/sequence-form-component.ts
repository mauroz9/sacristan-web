import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StepModalComponent } from '../../step-modal-component/step-modal-component';
import { CoverModalComponent } from '../../cover-modal-component/cover-modal-component';
import { firstValueFrom } from 'rxjs';
import { LoadingComponent } from "../../shared/loading-component/loading-component";
import { SecuenciasService } from '../../../../logic/services/secuencias-service';
import { ListCategoryResponse } from '../../../../logic/interfaces/extras-interface';
import { ExtraService } from '../../../../logic/services/extras-service';
import { CreateSequenceRequest, CreateStepRequest, SequenceDetailResponse, SequenceListResponse, StepResponse, UpdateSequenceRequest, UpdateStepRequest } from '../../../../logic/interfaces/secuencias-interface';

@Component({
  selector: 'app-sequence-form-component',
  imports: [ReactiveFormsModule, StepModalComponent, CoverModalComponent, RouterLink, LoadingComponent],
  templateUrl: './sequence-form-component.html',
  styleUrl: './sequence-form-component.css',
})
export class SequenceFormComponent implements OnInit {

  sequenceForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    category_id: new FormControl<number | null>(null, Validators.required),
    steps: new FormArray([]),
    frontPage: new FormControl<number | null>(null)
  });

  draggedIndex: number | null = null;
  showModal = false;
  showCoverModal = false;
  isEditMode = false;
  sequenceId: number | null = null;
  editingStepIndex: number | null = null;
  stepToEdit: { title: string, arasaacPictogramId: number } | null = null;
  categories: ListCategoryResponse[] = [];
  loading: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private secuenciasService: SecuenciasService,
    private extraService: ExtraService
    ) { }

  ngOnInit(): void {
    this.loading = true;
    this.extraService.getCategories().subscribe({
      next: (req) => {
        this.categories = req.content;
      },
      error: (err) => {
        alert('No se pudieron cargar las categorías. Intente nuevamente más tarde.');
      }
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.sequenceId = Number(id);
      this.loadSequenceData(this.sequenceId);
    } else {
      this.loading = false;
    }
  }

  loadSequenceData(id: number): void {
    this.secuenciasService.read(id).subscribe({
      next: (sequence: any) => {
        if (sequence) {
          this.sequenceForm.patchValue({
            title: sequence.title,
            description: sequence.description,
            category_id: sequence.category?.id || null,
            frontPage: sequence.frontPage || null
          });

          this.steps.clear();
          if (sequence.steps) {
            const sortedSteps = sequence.steps.sort((a: StepResponse, b: StepResponse) => a.position - b.position);

            sortedSteps.forEach((step: StepResponse) => {
              this.addStepToForm({
                title: step.name, 
                arasaacPictogramId: step.arasaacPictogramId 
              });
            });
          }
        }
        
        this.loading = false;
      },
    });
  }

  addStepToForm(step: { title: string, arasaacPictogramId: number | null }): void {
    const newStep = new FormGroup({
      title: new FormControl(step.title),
      arasaacPictogramId: new FormControl(step.arasaacPictogramId)
    });
    this.steps.push(newStep);
  }

  get steps(): FormArray {
    return this.sequenceForm.get('steps') as FormArray;
  }

  openCoverModal(): void {
    this.showCoverModal = true;
  }

  closeCoverModal(): void {
    this.showCoverModal = false;
  }

  handleSaveCover(frontPageId: number): void {
    this.sequenceForm.patchValue({ frontPage: frontPageId });
    this.closeCoverModal();
  }

  clearFrontPage(): void {
    this.sequenceForm.patchValue({ frontPage: null });
  }

  openModal(): void {
    this.editingStepIndex = null;
    this.stepToEdit = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingStepIndex = null;
    this.stepToEdit = null;
  }

  handleSaveStep(step: { title: string, arasaacPictogramId: number }): void {
    if (this.editingStepIndex !== null) {
      const stepControl = this.steps.at(this.editingStepIndex) as FormGroup;
      stepControl.patchValue({
        title: step.title,
        arasaacPictogramId: step.arasaacPictogramId
      });
    } else {
      this.addStepToForm({ title: step.title, arasaacPictogramId: step.arasaacPictogramId });
    }
    this.showModal = false;
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  modifyStep(index: number): void {
    const stepMod = this.steps.at(index) as FormGroup;
    this.editingStepIndex = index;
    this.stepToEdit = {
      title: stepMod.get('title')?.value,
      arasaacPictogramId: stepMod.get('arasaacPictogramId')?.value
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

  moveStep(fromIndex: number, toIndex: number): void {
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

  async onSubmit() {
  if (this.sequenceForm.valid) {
    const formValue = this.sequenceForm.value;
    
    try {
      const sequenceCategory = await firstValueFrom(this.extraService.getCategoryById(formValue.category_id!));

      const newSequence: CreateSequenceRequest | UpdateSequenceRequest = {
        title: formValue.title!,
        description: formValue.description!,
        categoryId: formValue.category_id!,

        steps: (formValue.steps as (CreateStepRequest | UpdateStepRequest)[]).map((step, index) => ({
          name: step.name,
          position: index + 1,
          estimatedDuration: null,
          arasaacPictogramId: step.arasaacPictogramId,
          sequenceId: this.isEditMode ? (this.sequenceId ?? 0) : 0,
        })),
        estimatedDuration: null,
        allowGoBack: false,
        frontPage: formValue.frontPage != null ? formValue.frontPage : this.steps.length > 0 ? this.steps.at(0).get('arasaacPictogramId')?.value : null,
      };

      const request$ = this.isEditMode 
        ? this.secuenciasService.update(this.sequenceId!, newSequence) 
        : this.secuenciasService.create(newSequence);

      request$.subscribe( (res) => {},
      (err) => {
        alert('Error al guardar la secuencia. Por favor, inténtelo de nuevo.');
      }
    )


      localStorage.setItem('infoMessage', this.isEditMode ? 'Secuencia modificada correctamente' : 'Secuencia creada correctamente');
      this.router.navigate(["/sequences"]);
      
    } catch (error) {
      alert('Error al guardar la secuencia. Por favor, inténtelo de nuevo.');
    }

  } else {
    this.sequenceForm.markAllAsTouched();
  }
}
}
