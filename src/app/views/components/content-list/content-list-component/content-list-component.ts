import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
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
import { SequenceService } from '../../../../logic/services/sequence-service';
import { TeacherService } from '../../../../logic/services/teacher-service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-content-list-component',
  imports: [SequenceRowComponent,
    StudentRowComponent, RouterLink,
    AsignSequencesComponent, StudentFormModalComponent,
    TeacherRowComponent, TeacherFormModalComponent,
    AsignStudentComponent, LoadingComponent,
    ReactiveFormsModule, FormsModule, NgClass],
  templateUrl: './content-list-component.html',
  styleUrl: './content-list-component.css',
})
export class ContentListComponent {

  content = input<Content>();
  loading = input<boolean>();
  reload = output<void>();
  loadingContent = signal<boolean>(false);
  functionality = "";
  searchTerm: string = '';
  sortBy: string = 'user.name';
  isAscending: boolean = true;
  sortTooltip: string = 'Orden ascendente';
  direction: string = 'asc';

  constructor(private router: Router, private studentService: StudentService, private sequenceService: SequenceService, private teacherService: TeacherService) {         
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

  onSearchChange() {
    this.loadingContent.set(true);
    this.sortContent();
  }

  async sortContent() {
    console.log("Sort content called");
    let r;
    
    if (this.content()?.kind == "alumno") {
      r = await firstValueFrom(this.studentService.getStudents(this.searchTerm, this.sortBy, this.direction));

      for (let student of r.content) {
        student.kind = "alumno";
      }

      this.content()!.contentList = r.content

    } else if (this.content()?.kind == "secuencia") {
      this.sequenceService.getSequences(this.searchTerm, this.sortBy, this.direction).subscribe(r => {

        for (let sequence of r.content) {
          sequence.kind = "secuencia";
        }

        this.content()!.contentList = r.content
      });
    } else if (this.content()?.kind == "profesor") {
      r = await firstValueFrom(this.teacherService.getTeachers(this.searchTerm, this.sortBy, this.direction));
      for (let teacher of r.content) {
        teacher.kind = "profesor";
      }

      this.content()!.contentList = r.content
    }

    this.loadingContent.set(false); 
  }

  onSortParamChange(event: any) {
    this.sortBy = event.target.value;
    this.loadingContent.set(true);    
    this.sortContent();
  }

  async toggleSort() {
    this.isAscending = !this.isAscending;
    this.sortTooltip = this.isAscending ? 'Orden ascendente' : 'Orden descendente';
    this.direction = this.isAscending ? 'asc' : 'desc';
    await this.sortContent()
  }

  reloadContent() {
    this.reload.emit();
  }

}
