import { Component, input, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from "@angular/router";
import { UserFormComponent } from "../../form-component/user-form-component/user-form-component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../../../logic/services/student-service';

@Component({
  selector: 'app-student-form-modal-component',
  imports: [RouterLink, UserFormComponent],
  templateUrl: './student-form-modal-component.html',
  styleUrl: './student-form-modal-component.css',
})
export class StudentFormModalComponent {
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;

  constructor (private modalService: NgbModal, private studentService: StudentService) {}

  functionality = input<string>(); // Usada en el frontend para mostrar si es "Crear" o "Editar".

  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent, { centered: true, backdrop: 'static', keyboard: false });
  }

  ngAfterViewInit(): void {
    this.openModal(this.modal);
  }

  sendData() {
    let userFormGroup = this.userFormComponent.userFormGroup;
    if (userFormGroup.valid) {
      const formData = userFormGroup.value;

      if(this.userFormComponent.isEditMode){
        formData.id = this.userFormComponent.userId;
      }
      
      //this.studentService.sendStudent(formData);
      this.modalService.dismissAll();
    } else {
      userFormGroup.markAllAsTouched();
    }
  }

}
