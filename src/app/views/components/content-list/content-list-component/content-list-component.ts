import { Component, input, output, signal } from '@angular/core';
import { SequenceRowComponent } from '../sequence-row-component/sequence-row-component';
import { Content } from '../../../../logic/interfaces/content-interface';
import { StudentRowComponent } from "../student-row-component/student-row-component";
import { Router, RouterLink } from '@angular/router';
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
import { RoutineService } from '../../../../logic/services/routine-service';
import { AsignSequencesComponent } from "../../asign-valuable-component/asign-valuable-component";
import { RoutineRowComponent } from "../routine-row-component/routine-row-component";

@Component({
  selector: 'app-content-list-component',
  imports: [SequenceRowComponent,
    StudentRowComponent, RouterLink, StudentFormModalComponent,
    TeacherRowComponent, TeacherFormModalComponent,
    AsignStudentComponent, LoadingComponent,
    ReactiveFormsModule, FormsModule, NgClass, AsignSequencesComponent, RoutineRowComponent],
  templateUrl: './content-list-component.html',
  styleUrl: './content-list-component.css',
})
export class ContentListComponent {

  content = input<Content>();
  loading = input<boolean>();
  reload = output<void>();
  sortChanged = output<{ query: string, sortBy: string, sortDir: string }>();
  loadingContent = signal<boolean>(false);
  functionality = "";
  searchTerm: string = '';
  sortBy: string = '';
  isAscending: boolean = true;
  sortTooltip: string = 'Orden ascendente';
  direction: string = 'asc';

  constructor(private router: Router, private studentService: StudentService, private sequenceService: SequenceService, private teacherService: TeacherService, private routineService: RoutineService) {
    if (this.router.url.includes('students/new')) {
      this.functionality = "newStudent";
    } else if (this.router.url.includes('students/modify')) {
      this.functionality = "modifyStudent";
    } else if (this.router.url.includes('students/assign-valuable')) {
      this.functionality = "assignValuable";
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
    let r;

    if (this.content()?.kind == "alumno") {
      r = await firstValueFrom(this.studentService.getStudents({
        query: this.searchTerm,
        sortBy: this.sortBy,
        sortDir: this.direction
      }));

      for (let student of r.content) {
        student.kind = "alumno";
      }

      this.content()!.contentList = r.content

    } else if (this.content()?.kind == "secuencia") {
      r = await firstValueFrom(this.sequenceService.getSequences({
        query: this.searchTerm,
        sortBy: this.sortBy,
        sortDir: this.direction
      }));

      for (let sequence of r.content) {
        sequence.kind = "secuencia";
      }

      this.content()!.contentList = r.content

    } else if (this.content()?.kind == "profesor") {
      r = await firstValueFrom(this.teacherService.getTeachers({
        query: this.searchTerm,
        sortBy: this.sortBy,
        sortDir: this.direction
      }));
      for (let teacher of r.content) {
        teacher.kind = "profesor";
      }

      this.content()!.contentList = r.content
    } else if (this.content()?.kind == "rutina") {
      r = await firstValueFrom(this.routineService.getRoutines({
        query: this.searchTerm,
        sortBy: this.sortBy,
        sortDir: this.direction
      }));
      for (let routine of r.content) {
        routine.kind = "rutina";
      }
      this.content()!.contentList = r.content;
    }

    this.sortChanged.emit({ query: this.searchTerm, sortBy: this.sortBy, sortDir: this.direction });
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
