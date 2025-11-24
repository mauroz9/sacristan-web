import { Component, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  stepData = input<{ description: string, imageUrl: string } | null>(null);

  selectedCategory: string = 'Todas';

  stepForm = new FormGroup({
    name: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required)
  });

  availableIcons = [
    'https://api.arasaac.org/api/pictograms/2347',
    'https://api.arasaac.org/api/pictograms/2350',
    'https://api.arasaac.org/api/pictograms/5432',
    'https://api.arasaac.org/api/pictograms/3210'
  ];

  categories = ['Higiene', 'Alimentación', 'Vestirse', 'Rutina', 'Colegio', 'Casa'];

  ngOnInit(): void {
    if(this.stepData() !== null){
      this.stepForm.patchValue({
        name: this.stepData()!.description,
        imageUrl: this.stepData()!.imageUrl
      });
    }
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }

  selectImage(url: string) {
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
