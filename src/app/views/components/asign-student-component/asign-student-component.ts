import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TeacherService } from '../../../logic/services/teacher-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Teacher } from '../../../logic/interfaces/teacher-interface';
import { Student } from '../../../logic/interfaces/student-interface';
import { StudentService } from '../../../logic/services/student-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-asign-student-component',
  imports: [RouterLink],
  templateUrl: './asign-student-component.html',
  styleUrl: './asign-student-component.css',
})
export class AsignStudentComponent implements OnInit {

    @ViewChild('modal') modal!: TemplateRef<any>;

  teacher: Teacher | null = null;
  selectedStudent: Student | null = null; // Use your Student type here
  nonAssignedStudents: Student[] = [];
  assignedStudents: Student[] = [];
  loading: boolean = false;

  constructor (private modalService: NgbModal, private router: Router, private teacherService:TeacherService, private studentService: StudentService, private route: ActivatedRoute) {}

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
      this.teacher = await firstValueFrom(this.teacherService.getTeacherById(teacherId));

      this.nonAssignedStudents = await firstValueFrom(this.studentService.getStudentsWithoutTeacher());
      this.assignedStudents = await firstValueFrom(this.studentService.getStudentsWithTeacher(teacherId));
    }
    this.loading = false;
  }

  selectStudent(student: Student) {
    this.selectedStudent = student; 
  }

  assignStudent() {
    if (this.selectedStudent) {
      this.studentService.assignTeacherToStudent(this.selectedStudent!.id!, this.teacher!.id!);
      localStorage.setItem('infoMessage', `Estudiante ${this.selectedStudent.user!.name} ${this.selectedStudent.user!.last_name} asignado al profesor ${this.teacher!.user!.name} ${this.teacher!.user!.last_name} correctamente.`);
      this.modalService.dismissAll();
      this.router.navigate(['/teachers']);
    }
  }

  unassignStudent(student: Student) { 
    this.studentService.unassignTeacherFromStudent(student.id!);
    localStorage.setItem('infoMessage', `Estudiante ${student.user!.name} ${student.user!.last_name} desvinculado del profesor ${this.teacher!.user!.name} ${this.teacher!.user!.last_name} correctamente.`);
    this.modalService.dismissAll();
    this.router.navigate(['/teachers']);
  }

}
