import { Component, TemplateRef, ViewChild } from '@angular/core';
import { UserFormComponent } from '../../form-component/user-form-component/user-form-component';
import { RouterLink } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../../logic/services/user-service';

@Component({
  selector: 'app-user-form-modal-component',
  imports: [UserFormComponent, RouterLink],
  templateUrl: './user-form-modal-component.html',
  styleUrl: './user-form-modal-component.css',
})
export class UserFormModalComponent {
  @ViewChild('modal') modal!: TemplateRef<any>;
  @ViewChild(UserFormComponent) userFormComponent!: UserFormComponent;

  constructor (private modalService: NgbModal, private userService: UserService) {}

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
    } else {
      userFormGroup.markAllAsTouched();
    }
  }

}
