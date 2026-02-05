import { Component, input, TemplateRef, ViewChild } from '@angular/core';
import { RouterLink } from "@angular/router";
import { UserFormComponent } from "../../form-component/user-form-component/user-form-component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../../../logic/services/student-service';
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

  constructor (private modalService: NgbModal, private teacherService: TeacherService) {}

  functionality = input<string>();

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

      if(this.userFormComponent.userId != null){
        formData.id = this.userFormComponent.userId;
      }
      
      // this.teacherService.sendTeacher(formData);
      this.modalService.dismissAll();
    } else {
      userFormGroup.markAllAsTouched();
    }
  }
}
