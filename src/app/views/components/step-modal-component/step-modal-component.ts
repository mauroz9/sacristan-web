import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ArasaacPictogram } from '../../../logic/interfaces/arasaac-interface';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { ArasaacService } from '../../../logic/services/arasaac-service';

@Component({
  selector: 'app-step-modal-component',
  imports: [ReactiveFormsModule],
  templateUrl: './step-modal-component.html',
  styleUrl: './step-modal-component.css',
})
export class StepModalComponent implements OnInit{
  isVisible = input<Boolean>(false);
  close = output<void>();
  save = output<{ name: string, imageUrl: string }>();
  stepData = input<{ title: string, imageUrl: string } | null>(null);

  selectedCategory: string = 'Todas';

  pictograms: ArasaacPictogram[] = [];
  loading = false;

  stepForm = new FormGroup({
    name: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required)
  });

  searchControl = new FormControl('', Validators.minLength(3));

  constructor(private arasaacService: ArasaacService){}

  categories = ['Higiene', 'Alimentación', 'Vestirse', 'Rutina', 'Colegio', 'Casa'];

  ngOnInit(): void {
    if(this.stepData() !== null){
      this.stepForm.patchValue({
        name: this.stepData()!.title,
        imageUrl: this.stepData()!.imageUrl
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
      this.searchControl.setValue('');
      this.pictograms = [];
    }
  }

  selectImage(id: number) {
    var url = '';
    
    this.arasaacService.getPictogramImage(id).subscribe(req => {
      url = req;
    });
    this.stepForm.patchValue({ imageUrl: url });
  }

  onSave() {
    if (this.stepForm.valid) {
      this.save.emit({
        name: this.stepForm.value.name!,
        imageUrl: this.stepForm.value.imageUrl!
      });
      this.stepForm.reset();

    } else {
      this.stepForm.markAllAsTouched();
    }
  }

  onClose() {
    this.stepForm.reset();
    this.close.emit();
  }
}
