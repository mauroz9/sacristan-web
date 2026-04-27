import { Component, input, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { UserFormComponent } from "../../form-component/user-form-component/user-form-component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlumnosService } from '../../../../logic/services/alumnos-service';

@Component({
  selector: 'app-student-form-modal-component',
  imports: [RouterLink, UserFormComponent],
  templateUrl: './student-form-modal-component.html',
  styleUrl: './student-form-modal-component.css',
})
export class StudentFormModalComponent {
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;

  constructor (private modalService: NgbModal, private alumnosService: AlumnosService, private router: Router) {}

  functionality = input<string>(); // Usada en el frontend para mostrar si es "Crear" o "Editar".

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
      
      this.alumnosService.sendStudent(formData).subscribe({
        next: (data) => {
          this.modalService.dismissAll();
          this.router.navigate(['/students']);
        },
        error: (error) => {
          if (error.status == 400) {
            this.alumnosService.handleFormErrors(error.error["invalid-params"], this.userFormComponent.userFormGroup);
          } else {
            alert("Ha sucedido un error inesperado, pongase en contacto con el soporte.");
          }
        }
      });

    } else {
      userFormGroup.markAllAsTouched();
    }
  }

}
