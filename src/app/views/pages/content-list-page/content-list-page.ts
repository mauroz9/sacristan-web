import { Component, OnInit } from '@angular/core';
import { Content, SortParam } from '../../../logic/interfaces/content-interface';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
import { ContentListComponent } from '../../components/content-list/content-list-component/content-list-component';
import { Router } from '@angular/router';
import { StudentService } from '../../../logic/services/student-service';
import { SequenceService } from '../../../logic/services/sequence-service';
import { firstValueFrom } from 'rxjs';
import { Teacher } from '../../../logic/interfaces/teacher-interface';
import { TeacherService } from '../../../logic/services/teacher-service';
import { StudentResponse } from '../../../logic/interfaces/user/student/student-interface';
import { TeacherResponse } from '../../../logic/interfaces/user/teacher/teacher-interface';

@Component({
  selector: 'app-content-list-page',
  imports: [ContentListComponent],
  templateUrl: './content-list-page.html',
  styleUrl: './content-list-page.css',
})
export class ContentListPage implements OnInit {

  constructor(
    private router: Router,
    private studentService: StudentService,
    private sequenceService: SequenceService,
    private teacherService: TeacherService
  ) { }

  url = "";

  sequenceList: Sequence[] = [];
  studentList: StudentResponse[] = []
  teacherList: TeacherResponse[] = [];
  sortParams: SortParam[] = [];
  infoMessage: string | null = null;
  errorMessage: string | null = null;

  contentSequence: Content = {
    kind: "secuencia",
    url: "/sequences",
    title: "Secuencia de pasos",
    subTitle: "Gestiona las secuencias de pictogramas para los estudiantes",
    searchparams: "Buscar por título o descripción",
    gender: 0,
    contentList: []
  }

  content: Content = this.contentSequence;
  loading: boolean = true;

  reloadContent() {
    this.getData();

    this.infoMessage = localStorage.getItem('infoMessage');
    if (this.infoMessage) {
      localStorage.removeItem('infoMessage');
    }

    this.errorMessage = localStorage.getItem('errorMessage');
    if (this.errorMessage) {
      localStorage.removeItem('errorMessage');
    }
  }

  ngOnInit(): void {
    this.reloadContent();
  }

  async getData() {

    try {
      this.url = this.router.url;
      if (this.url.includes('/students')) {
        this.studentList = (await firstValueFrom(this.studentService.getStudents())).content;
        this.sortParams = await firstValueFrom(this.studentService.getSortParams());
        console.log(this.sortParams);
        
      } else if (this.url.includes('/teachers')) {
        this.teacherList = (await firstValueFrom(this.teacherService.getTeachers())).content;
        this.sortParams = await firstValueFrom(this.teacherService.getSortParams());
      } else if (this.url.includes('/sequences')) {
        this.sequenceList = (await firstValueFrom(this.sequenceService.getSequences())).content;
        this.sortParams = await firstValueFrom(this.sequenceService.getSortParams());
      }
      this.loadData();
    } catch (error: any) {
      console.error("Error loading data for content list page:", error);      
      
      if (error.status === 401) {        
        console.log("Volviendo al login debido a falta de acceso");
        
        localStorage.setItem('errorMessage', 'Sesión expirada. Por favor, inicia sesión de nuevo.');
        localStorage.removeItem('auth_token');
        this.router.navigate(['/login']);
      }
    }
    
  }


  loadData() {
    if (this.url.includes('/sequences')) {
      for (let sequence of this.sequenceList) {
        sequence.kind = "secuencia";
      }

      this.contentSequence.contentList = this.sequenceList;
      
      this.content = this.contentSequence;

      let searchParams = ""

      for (let i = 0; i < this.sortParams.length; i++) {
        if (i == this.sortParams.length - 1) {
          searchParams += this.sortParams[i].key.toLowerCase();
        } else {
          searchParams += this.sortParams[i].key.toLowerCase() + ", ";
        }
      }

      this.content.searchparams = searchParams;
      this.content.sortparams= this.sortParams

    } else if (this.url.includes('/students')) {
      
      for (let student of this.studentList) {
        student.kind = "alumno";
      }      

      let searchParams = ""

      for (let i = 0; i < this.sortParams.length; i++) {
        if (i == this.sortParams.length - 1) {
          searchParams += this.sortParams[i].key.toLowerCase();
        } else {
          searchParams += this.sortParams[i].key.toLowerCase() + ", ";
        }
      }

      this.content = {
        kind: "alumno",
        url: "/students",
        title: "Listado de alumnos",
        subTitle: "Gestiona los alumnos del centro",
        gender: 1,
        searchparams: "Buscar por " + searchParams,
        sortparams: this.sortParams,
        contentList: this.studentList
      }
    } else if (this.url.includes('/teachers')) {
      for (let teacher of this.teacherList) {
        teacher.kind = "profesor";
      }

      let searchParams = ""

      for (let i = 0; i < this.sortParams.length; i++) {
        if (i == this.sortParams.length - 1) {
          searchParams += this.sortParams[i].key.toLowerCase();
        } else {
          searchParams += this.sortParams[i].key.toLowerCase() + ", ";
        }
      }

      this.content = {
        kind: "profesor",
        url: "/teachers",
        title: "Listado de profesores",
        subTitle: "Gestiona los profesores del centro",
        gender: 1,
        plural: 1,
        searchparams: "Buscar por " + searchParams,
      sortparams: this.sortParams,
        contentList: this.teacherList
      }
    } else {
      console.log("Something went wrong loading content list page data");
    }
    this.loading = false;
  }

}
