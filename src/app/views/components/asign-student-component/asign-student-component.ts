import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { LoadingComponent } from "../shared/loading-component/loading-component";
import { ProfesoresService } from '../../../logic/services/profesores-service';
import { AlumnosService } from '../../../logic/services/alumnos-service';
import { AssignedStudentResponse, UnAssignedStudentResponse } from '../../../logic/interfaces/profesores-interface';
import { ReadUserResponse } from '../../../logic/interfaces/extras/users-interface';


@Component({
  selector: 'app-asign-student-component',
  imports: [RouterLink, LoadingComponent],
  templateUrl: './asign-student-component.html',
  styleUrl: './asign-student-component.css',
})
export class AsignStudentComponent implements OnInit {

    @ViewChild('modal') modal!: TemplateRef<any>;

  teacher: ReadUserResponse | null = null;
  selectedStudent: UnAssignedStudentResponse | null = null; // Use your Student type here
  nonAssignedStudents: UnAssignedStudentResponse[] = [];
  assignedStudents: AssignedStudentResponse[] = [];
  loading: boolean = false;

  constructor (private modalService: NgbModal, private router: Router,
    private profesoresService:ProfesoresService, private alumnosService: AlumnosService
    , private route: ActivatedRoute) {}

  openModal(modalContent: TemplateRef<any>) {
    this.modalService.open(modalContent, { centered: true, backdrop: 'static', keyboard: false });
  }

  ngOnInit(): void {
    this.loading = true;
  }

  async ngAfterViewInit(): Promise<void> {
    this.openModal(this.modal);
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      const teacherId = Number(id);
      this.teacher = await firstValueFrom(this.profesoresService.read(teacherId));

      this.nonAssignedStudents = await firstValueFrom(this.profesoresService.getStudentsWithoutTeacher());
      this.assignedStudents = await firstValueFrom(this.profesoresService.getStudentsByTeacher(teacherId));
    }
    this.loading = false;
  }

  selectStudent(student: UnAssignedStudentResponse) {
    this.selectedStudent = student; 
  }

  assignStudent() {
    if (this.selectedStudent) {
      this.profesoresService.assignStudentToTeacher(this.selectedStudent!.id!, this.teacher!.id!);
      localStorage.setItem('infoMessage', `Estudiante ${this.selectedStudent.name} ${this.selectedStudent.lastName} asignado al profesor ${this.teacher!.name} ${this.teacher!.lastName} correctamente.`);
      this.modalService.dismissAll();
      this.router.navigate(['/teachers']);
    }
  }

  unassignStudent(student: AssignedStudentResponse) { 
    this.profesoresService.unassignStudentFromTeacher(student.id!, student.teacherId);
    localStorage.setItem('infoMessage', `Estudiante ${student.name} ${student.lastName} desvinculado del profesor ${this.teacher!.name} ${this.teacher!.lastName} correctamente.`);
    this.modalService.dismissAll();
    this.router.navigate(['/teachers']);
  }

}
