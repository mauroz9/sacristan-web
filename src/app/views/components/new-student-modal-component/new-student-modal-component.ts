import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-new-student-modal-component',
  imports: [RouterLink],
  templateUrl: './new-student-modal-component.html',
  styleUrl: './new-student-modal-component.css',
})
export class NewStudentModalComponent implements AfterViewInit {

  @ViewChild('modal') modal!: TemplateRef<any>;

  constructor(private router: Router, private modalService: NgbModal) {}

  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent, { centered: true, backdrop: 'static' })
  }

  ngAfterViewInit(): void {
    this.openModal(this.modal);
  }

}
