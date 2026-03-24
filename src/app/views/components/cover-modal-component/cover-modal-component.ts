import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArasaacPictogram } from '../../../logic/interfaces/arasaac-interface';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { ArasaacService } from '../../../logic/services/extras/arasaac-service';
import { LoadingComponent } from "../shared/loading-component/loading-component";

@Component({
  selector: 'app-cover-modal-component',
  imports: [ReactiveFormsModule, LoadingComponent],
  templateUrl: './cover-modal-component.html',
  styleUrl: './cover-modal-component.css',
})
export class CoverModalComponent implements OnInit {
  isVisible = input<Boolean>(false);
  close = output<void>();
  save = output<number>();
  frontPage = input<number | null>(null);

  selectedCategory: string = 'Todas';
  pictograms: ArasaacPictogram[] = [];
  loading = false;

  coverForm = new FormGroup({
    frontPage: new FormControl<number | null>(null, Validators.required)
  });

  searchControl = new FormControl('', Validators.minLength(3));

  constructor(private arasaacService: ArasaacService) { }

  categories = ['Higiene', 'Alimentación', 'Vestirse', 'Rutina', 'Colegio', 'Casa'];

  ngOnInit(): void {
    this.coverForm.patchValue({
      frontPage: this.frontPage() ?? null
    });

    this.loading = true;
    this.arasaacService.getPictograms().pipe(
      catchError(() => of([]))
    ).subscribe(results => {
      this.pictograms = results;
      this.loading = false;
    });

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
    this.coverForm.patchValue({ frontPage: id });
  }

  onSave() {
    if (this.coverForm.valid) {
      this.save.emit(this.coverForm.value.frontPage!);
      this.searchControl.reset();
      this.pictograms = [];
    } else {
      this.coverForm.markAllAsTouched();
    }
  }

  onClose() {
    this.searchControl.reset();
    this.pictograms = [];
    this.close.emit();
  }

  get hasActiveSearch(): boolean {
    const searchValue = (this.searchControl.value ?? '').trim();
    return searchValue.length > 0 || this.selectedCategory !== 'Todas';
  }
}
