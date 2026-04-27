import { Component, input, output, signal } from '@angular/core';
import { StudentRowComponent } from "../student-row-component/student-row-component";
import { Router, RouterLink } from '@angular/router';
import { StudentFormModalComponent } from "../../form-modals/student-form-modal-component/student-form-modal-component";
import { TeacherRowComponent } from "../teacher-row-component/teacher-row-component";
import { TeacherFormModalComponent } from "../../form-modals/teacher-form-modal-component/teacher-form-modal-component";
import { LoadingComponent } from "../../shared/loading-component/loading-component";
import { AlumnosService } from '../../../../logic/services/alumnos-service';
import { ReactiveFormsModule } from '@angular/forms';
import { SecuenciasService } from '../../../../logic/services/secuencias-service';
import { ProfesoresService } from '../../../../logic/services/profesores-service';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { RutinasService } from '../../../../logic/services/rutinas-service';
import { RoutineRowComponent } from "../routine-row-component/routine-row-component";
import { Content } from '../../../../logic/interfaces/extras/content/content-interface';
import { SequenceRowComponent } from '../sequence-row-component/sequence-row-component';
import { AsignSequencesComponent } from "../../asign-valuable-component/asign-valuable-component";
import { AsignStudentComponent } from "../../asign-student-component/asign-student-component";

@Component({
  selector: 'app-content-list-component',
  standalone: true,
  imports: [
    StudentRowComponent, RouterLink, StudentFormModalComponent,
    TeacherRowComponent, TeacherFormModalComponent, LoadingComponent,
    ReactiveFormsModule, FormsModule, NgClass, RoutineRowComponent, SequenceRowComponent,
    AsignSequencesComponent,
    AsignStudentComponent
],
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

  constructor(private router: Router, private alumnosService: AlumnosService, private secuenciasService: SecuenciasService, private profesoresService: ProfesoresService, private rutinasService: RutinasService) {
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
    
    // Build params object, only including non-default values
    const params: any = { query: this.searchTerm };
    if (this.sortBy) params.sortBy = this.sortBy;
    if (this.direction !== 'asc') params.sortDir = this.direction;

    if (this.content()?.kind == "estudiante") {
      r = await firstValueFrom(this.alumnosService.list(params));

      for (let student of r.content) {
        student.kind = "estudiante";
      }

      this.content()!.contentList = r.content
      

    } else if (this.content()?.kind == "secuencia") {
      r = await firstValueFrom(this.secuenciasService.list(params));

      for (let sequence of r.content) {
        sequence.kind = "secuencia";
      }

      this.content()!.contentList = r.content

    } else if (this.content()?.kind == "profesor") {
      r = await firstValueFrom(this.profesoresService.list(params));
      for (let teacher of r.content) {
        teacher.kind = "profesor";
      }

      this.content()!.contentList = r.content
    } else if (this.content()?.kind == "rutina") {
      r = await firstValueFrom(this.rutinasService.list(params));
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
    console.log(this.sortTooltip)
    this.direction = this.isAscending ? 'asc' : 'desc';
    await this.sortContent()
  }

  reloadContent() {
    this.reload.emit();
  }

}
