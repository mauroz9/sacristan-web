import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-student-modal-component',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './new-student-modal-component.html',
  styleUrl: './new-student-modal-component.css',
})
export class NewStudentModalComponent implements AfterViewInit {

  @ViewChild('modal') modal!: TemplateRef<any>;

  studentFormGroup: FormGroup;

  constructor(private modalService: NgbModal, private router: Router) {
    this.studentFormGroup = new FormGroup({
      // Define form controls here as needed
      nameFormControl: new FormControl('',[Validators.required, Validators.minLength(1)]),
      lastNameFormControl: new FormControl('',[Validators.required, Validators.minLength(1)]),
      gradeFormControl: new FormControl('',[Validators.required]),
      disabilityFormControl: new FormControl(null, [this.fileRequiredValidator]),
      photoFormControl: new FormControl(null, [this.fileRequiredValidator]),
    });
  }

  // Custom validator for file inputs
  fileRequiredValidator = (control: AbstractControl): ValidationErrors | null => {
    const files = control.value;
    if (!files || !(files instanceof FileList) || files.length === 0) {
      return { required: true };
    }
    return null;
  };


  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent, { centered: true, backdrop: 'static', keyboard: false });
  }

  ngAfterViewInit(): void {
    this.openModal(this.modal);
  }

  sendData() {
    if (this.studentFormGroup.valid) {
      const formData = this.studentFormGroup.value;
      // Process form data here
      this.modalService.dismissAll();
      console.log(formData);      
      this.router.navigate(['/students']);
    } else {
      this.studentFormGroup.markAllAsTouched();
    }
  }

  // Handle file input change events
  onFileChange(event: Event, controlName: string): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const files = target.files;
      this.studentFormGroup.get(controlName)?.setValue(files);
      this.studentFormGroup.get(controlName)?.markAsTouched();
    }
  }

}
