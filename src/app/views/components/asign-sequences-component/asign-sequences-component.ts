import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentService } from '../../../logic/services/student-service';
import { Student } from '../../../logic/interfaces/student-interface';

@Component({
  selector: 'app-asign-sequences-component',
  imports: [RouterLink],
  templateUrl: './asign-sequences-component.html',
  styleUrl: './asign-sequences-component.css',
})
export class AsignSequencesComponent implements AfterViewInit {

  @ViewChild('modal') modal!: TemplateRef<any>;

  student: Student | null = null;
  
  constructor (private modalService: NgbModal, private router: Router, private studentService:StudentService, private route: ActivatedRoute) {}

  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent, { centered: true, backdrop: 'static', keyboard: false });
  }

  ngAfterViewInit(): void {
    this.openModal(this.modal);
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      const studentId = Number(id);
      this.studentService.getStudentById(studentId).subscribe(data => {
          this.student = data;          
        });
    }
  }

}
