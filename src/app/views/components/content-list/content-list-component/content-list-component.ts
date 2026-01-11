import { Component, input, output } from '@angular/core';
import { SequenceRowComponent } from '../sequence-row-component/sequence-row-component';
import { Content } from '../../../../logic/interfaces/content-interface';
import { StudentRowComponent } from "../student-row-component/student-row-component";
import { Router, RouterLink } from '@angular/router';
import { AsignSequencesComponent } from "../../asign-sequences-component/asign-sequences-component";
import { StudentFormModalComponent } from "../../form-modals/student-form-modal-component/student-form-modal-component";
import { TeacherRowComponent } from "../teacher-row-component/teacher-row-component";
import { TeacherFormModalComponent } from "../../form-modals/teacher-form-modal-component/teacher-form-modal-component";
import { AsignStudentComponent } from "../../asign-student-component/asign-student-component";
import { LoadingComponent } from "../../shared/loading-component/loading-component";
import { StudentService } from '../../../../logic/services/student-service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-content-list-component',
  imports: [SequenceRowComponent, 
    StudentRowComponent, RouterLink, 
    AsignSequencesComponent, StudentFormModalComponent, 
    TeacherRowComponent, TeacherFormModalComponent, 
    AsignStudentComponent, LoadingComponent,
    ReactiveFormsModule
  ],
  templateUrl: './content-list-component.html',
  styleUrl: './content-list-component.css',
})
export class ContentListComponent {

  content = input<Content>();
  loading = input<boolean>();
  reload = output<void>();
  loadingStudents = false;
  functionality = "";

  constructor(private router: Router, private studentService: StudentService) {         
      if (this.router.url.includes('students/new')) {       
        this.functionality = "newStudent";
      } else if (this.router.url.includes('students/modify')) {
        this.functionality = "modifyStudent";
      } else if (this.router.url.includes('students/asign-sequences')) {
        this.functionality = "assignSequences";
      } else if (this.router.url.includes('teachers/new')) {
        this.functionality = "newTeacher";
      } else if (this.router.url.includes('teachers/modify')) {
        this.functionality = "modifyTeacher";
      } else if (this.router.url.includes('teachers/assign-students')) {
        this.functionality = "assignStudent";
      }
  }

  filtarBack(filterText: string) {
    this.loadingStudents = true
    console.log();
    
    if (this.content()?.kind == "alumno") {
      this.studentService.getStudent(filterText).subscribe(r => {

        for (let student of r) {
          student.kind = "alumno";
        }

        this.content()!.contentList = r
        this.loadingStudents = false
      });
    }
  }

  clearFilter(filterInput: HTMLInputElement) {
    filterInput.value = ""
    this.filtarBack("")
  }

  reloadContent() {
    this.reload.emit();
  }

}
