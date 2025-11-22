import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  constructor(private modalService: NgbModal, private router: Router) {}


  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent, { centered: true, backdrop: 'static', keyboard: false });
  }

  ngAfterViewInit(): void {
    this.openModal(this.modal);
  }

  studentFormGroup: FormGroup = new FormGroup({
    // Define form controls here as needed
    nameFormControl: new FormControl('',[Validators.required, Validators.minLength(1)]),
    lastNameFormControl: new FormControl('',[Validators.required, Validators.minLength(1)]),
    gradeFormControl: new FormControl('',[Validators.required, ]),
    disabilityFormControl: new FormControl('',[Validators.required]),
    photoFormControl: new FormControl('',[Validators.required]),
  });

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

}
