import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { ArasaacService } from '../../../logic/services/extras/arasaac-service';
import { LoadingComponent } from "../shared/loading-component/loading-component";
import { ArasaacPictogram } from '../../../logic/interfaces/extras/content/arasaac-interface';
import { CreateStepRequest, UpdateStepRequest } from '../../../logic/interfaces/secuencias-interface';

@Component({
  selector: 'app-step-modal-component',
  imports: [ReactiveFormsModule, LoadingComponent],
  templateUrl: './step-modal-component.html',
  styleUrl: './step-modal-component.css',
})
export class StepModalComponent implements OnInit {
  isVisible = input<boolean>(false);
  close = output<void>();
  save = output<CreateStepRequest | UpdateStepRequest>();
  stepData = input<UpdateStepRequest | null>(null);
  isEdit: boolean = false;

  selectedCategory: string = 'Todas';

  pictograms: ArasaacPictogram[] = [];
  loading = false;

  stepForm = new FormGroup({
    name: new FormControl('', Validators.required),
    arasaacPictogramId: new FormControl<number | null>(null, Validators.required)
  });

  searchControl = new FormControl('', Validators.minLength(3));

  constructor(private arasaacService: ArasaacService) { }

  categories = ['Higiene', 'Alimentación', 'Vestirse', 'Rutina', 'Colegio', 'Casa'];

  ngOnInit(): void {
    this.loading = true;
    this.arasaacService.getPictograms().pipe(
      catchError(() => of([]))
    ).subscribe(results => {
      this.pictograms = results;
      this.loading = false;
    });

    if (this.stepData() !== null) {
      this.isEdit = true;
      this.stepForm.patchValue({
        name: this.stepData()!.name,
        arasaacPictogramId: this.stepData()!.arasaacPictogramId
      });

      this.loading = true;
      this.arasaacService.getPictogramsBySearch(this.stepData()!.name).pipe(
        catchError(() => of([]))
      ).subscribe(results => {
        this.pictograms = results;
        this.loading = false;
      });
    }

    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term) return of([]);
        this.loading = true;
        return this.arasaacService.getPictogramsBySearch(term).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe(results => {
      this.pictograms = results;
      this.loading = false;
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    if (cat !== 'Todas') {
      this.searchControl.setValue(cat);
    } else {
      this.loading = true;
      this.arasaacService.getPictograms().pipe(
        catchError(() => of([]))
      ).subscribe(results => {
        this.pictograms = results;
        this.loading = false;
      });
    }
  }

  getPictogramImage(id: number): string {
    return this.arasaacService.getPictogramImage(id);
  }

  selectImage(id: number) {
    this.stepForm.patchValue({ arasaacPictogramId: id });
  }

  onSave() {
    if (this.stepForm.valid) {
      if (this.isEdit && this.stepData() !== null) {
        const updateRequest: UpdateStepRequest = {
          name: this.stepForm.value.name!,
          arasaacPictogramId: this.stepForm.value.arasaacPictogramId!,
          position: (this.stepData() as UpdateStepRequest).position,
          estimatedDuration: (this.stepData() as UpdateStepRequest).estimatedDuration
        };
        this.save.emit(updateRequest);
      } else {
        const createRequest: CreateStepRequest = {
          name: this.stepForm.value.name!,
          position: 0,
          estimatedDuration: null,
          arasaacPictogramId: this.stepForm.value.arasaacPictogramId!
        };
        this.save.emit(createRequest);
      }
      this.stepForm.reset();
      this.searchControl.reset();
      this.pictograms = [];
    } else {
      this.stepForm.markAllAsTouched();
    }
  }

  onClose() {
    this.stepForm.reset();
    this.searchControl.reset();
    this.pictograms = [];
    this.close.emit();
  }

  get hasActiveSearch(): boolean {
    const searchValue = (this.searchControl.value ?? '').trim();
    return searchValue.length > 0 || this.selectedCategory !== 'Todas';
  }
}
