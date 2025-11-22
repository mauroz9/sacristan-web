import { Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-step-modal-component',
  imports: [ReactiveFormsModule],
  templateUrl: './step-modal-component.html',
  styleUrl: './step-modal-component.css',
})
export class StepModalComponent {
  isVisible = input<Boolean>(false);
  close = output<void>();
  save = output<{name: string, imageUrl: string}>();

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

  selectImage(url: string) {
    this.stepForm.patchValue({ imageUrl: url });
  }

  onSave(){
    if(this.stepForm.valid){
      this.save.emit({
        name: this.stepForm.value.name!,
        imageUrl: this.stepForm.value.imageUrl!
      });

    }else{
      this.stepForm.markAllAsTouched();
    }
  }

  onClose(){
    this.close.emit();
    this.stepForm.reset();
  }
}
