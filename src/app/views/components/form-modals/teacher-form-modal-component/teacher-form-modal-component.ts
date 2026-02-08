import { Component, input, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { UserFormComponent } from "../../form-component/user-form-component/user-form-component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeacherService } from '../../../../logic/services/teacher-service';

@Component({
  selector: 'app-teacher-form-modal-component',
  imports: [RouterLink, UserFormComponent],
  templateUrl: './teacher-form-modal-component.html',
  styleUrl: './teacher-form-modal-component.css',
})
export class TeacherFormModalComponent {
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;

  constructor (private modalService: NgbModal, private teacherService: TeacherService, private router: Router) {}

  functionality = input<string>();

  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent, { centered: true, backdrop: 'static', keyboard: false, size: 'lg' });
  }

  ngAfterViewInit(): void {
    this.openModal(this.modal);
  }

    sendData() {    
    let userFormGroup = this.userFormComponent.userFormGroup;
    if (userFormGroup.valid) {
            const formData = userFormGroup.value;

      if(this.userFormComponent.userId != null){
        formData.id = this.userFormComponent.userId;
      }
      
      this.teacherService.sendTeacher(formData).subscribe({
        next: (data) => {
          console.log("Teacher data sent successfully", data);
          this.modalService.dismissAll();
          this.router.navigate(['/teachers']);
        },
        error: (error) => {
          console.error("Error sending teacher data: ");
          if (error.status == 400) {
            this.teacherService.handleFormErrors(error.error["invalid-params"], this.userFormComponent.userFormGroup);
          } else {
            alert("Ha sucedido un error inesperado, pongase en contacto con el soporte.");
            console.error(error);
          }
        }
      });

    } else {
      alert("El formulario no es válido. Por favor, complete todos los campos requeridos correctamente.");
      userFormGroup.markAllAsTouched();
    }
  }

  

}

