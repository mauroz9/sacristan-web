import { AfterViewInit, Component, output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../../../logic/services/student-service';
import { Student } from '../../../../logic/interfaces/student-interface';
@Component({
  selector: 'app-student-form-modal-component',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './student-form-modal-component.html',
  styleUrls: ['./student-form-modal-component.css'],
})
export class NewStudentModalComponent implements AfterViewInit {

  @ViewChild('modal') modal!: TemplateRef<any>;

  functionality = output<string>();
  isEditMode: boolean = false;
  studentId: number | null = null;

  constructor(private modalService: NgbModal, private router: Router, private studentService:StudentService, private route: ActivatedRoute) {}

  baseStudent : Student = {
    kind: 'alumno',
    id: 0,
    name: '',
    lastName: '',
    email: '',
    password: '',
    assignedSequences: 0
  }

  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent, { centered: true, backdrop: 'static', keyboard: false });
  }

  ngAfterViewInit(): void {
    this.openModal(this.modal);
    const id = this.route.snapshot.paramMap.get('id');
  
    if(id){
      const studentId = Number(id);
      this.studentService.getStudentById(studentId).subscribe(data => {
          this.baseStudent = this.studentService.convertToStudent(data.usuario);          
          
          this.isEditMode = true;
          this.studentId = Number(id);

          this.studentFormGroup.get('passwordFormControl')?.setValidators([]);
          
          this.studentFormGroup.patchValue({
            nameFormControl: this.baseStudent.name,
            lastNameFormControl: this.baseStudent.lastName,
            emailFormControl: this.baseStudent.email,
            passwordFormControl: '',
            // disabilityFormControl: '',
            // photoFormControl: ''
          });
        }
      );
          
    }

  }

  studentFormGroup: FormGroup = new FormGroup({
    // Define form controls here as needed
    nameFormControl: new FormControl('',[Validators.required, Validators.minLength(1)]),
    lastNameFormControl: new FormControl('',[Validators.required, Validators.minLength(1)]),
    emailFormControl: new FormControl('',[Validators.required, Validators.minLength(1), Validators.email]),
    passwordFormControl: new FormControl('',[Validators.required, Validators.minLength(8)]),
    // disabilityFormControl: new FormControl('',[Validators.required]),
    // photoFormControl: new FormControl('',[Validators.required]),
  });

  sendData() {
    if (this.studentFormGroup.valid) {
      const formData = this.studentFormGroup.value;
      // Process form data here
      this.modalService.dismissAll();
      if(this.isEditMode){
        formData.id = this.studentId;
      }
      this.studentService.sendStudent(formData);
    } else {
      this.studentFormGroup.markAllAsTouched();
    }
  }

}
