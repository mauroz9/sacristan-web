import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { RoutineService } from '../../../logic/services/routine-service';
import { Routine } from '../../../logic/interfaces/routine-interface';
import { LoadingComponent } from '../../components/shared/loading-component/loading-component';

@Component({
  selector: 'app-content-list-page',
  imports: [ContentListComponent, LoadingComponent],
  templateUrl: './content-list-page.html',
  styleUrl: './content-list-page.css',
})
export class ContentListPage implements OnInit {

  constructor(
    private router: Router,
    private studentService: StudentService,
    private sequenceService: SequenceService,
    private teacherService: TeacherService,
    private routineService: RoutineService
  ) { }

  url = "";

  sequenceList: Sequence[] = [];
  studentList: StudentResponse[] = []
  teacherList: TeacherResponse[] = [];
  routineList: Routine[] = [];
  sortParams: SortParam[] = [];
  infoMessage: string | null = null;
  errorMessage: string | null = null;
  page = 0;
  isLoading = false;
  allLoaded = false;
  currentQuery = '';
  currentSortBy = '';
  currentSortDir = 'asc';

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
    this.page = 0;
    this.allLoaded = false;

    try {
      this.url = this.router.url;
      if (this.url.includes('/students')) {
        this.studentList = (await firstValueFrom(this.studentService.getStudents())).content;
        console.log(this.studentList);
        
        this.sortParams = await firstValueFrom(this.studentService.getSortParams());
        
      } else if (this.url.includes('/teachers')) {
        this.teacherList = (await firstValueFrom(this.teacherService.getTeachers())).content;
        this.sortParams = await firstValueFrom(this.teacherService.getSortParams());
      } else if (this.url.includes('/sequences')) {
        this.sequenceList = (await firstValueFrom(this.sequenceService.getSequences())).content;
        this.sortParams = await firstValueFrom(this.sequenceService.getSortParams());
      } else if(this.url.includes('/routines')){
        this.routineList = (await firstValueFrom(this.routineService.getRoutines())).content;
        this.sortParams = await firstValueFrom(this.routineService.getSortParams());
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

  async callPage() {
    var res: StudentResponse[] | TeacherResponse[] | Sequence[] | Routine[] = [];
    if (this.isLoading || this.allLoaded || this.loading) return;
    this.isLoading = true;
    
    this.page++;  
    this.url = this.router.url;

      const params: GetParams = {
        page: this.page,
        query: this.currentQuery,
        sortBy: this.currentSortBy || undefined,
        sortDir: this.currentSortDir
      };

      if (this.url.includes('/students')) {

        res = (await firstValueFrom(this.studentService.getStudents(params))).content;

        if(res.length == 0){
          this.allLoaded = true;
        } else {
          console.log(res);
          this.studentList.push(...res);
        }

      } else if (this.url.includes('/teachers')) {

        res = (await firstValueFrom(this.teacherService.getTeachers(params))).content;

        if(res.length == 0){
          this.allLoaded = true;
        } else {
          console.log(res);
          this.teacherList.push(...res);
        }

      } else if (this.url.includes('/sequences')) {
        res = (await firstValueFrom(this.sequenceService.getSequences(params))).content;

        if(res.length == 0){
          this.allLoaded = true;
        } else {
          console.log(res);
          this.sequenceList.push(...res);
        }
      } else if(this.url.includes('/routines')){
        res = (await firstValueFrom(this.routineService.getRoutines(params))).content
        if(res.length == 0){
          this.allLoaded = true;
        } else {
          console.log(res);
          this.routineList.push(...res);
        }
      }

      this.isLoading = false;
      this.loadData();
  }

  onSortChanged(params: { query: string, sortBy: string, sortDir: string }) {
    this.currentQuery = params.query;
    this.currentSortBy = params.sortBy;
    this.currentSortDir = params.sortDir;
    this.page = 0;
    this.allLoaded = false;

    if (this.url.includes('/students')) {
      this.studentList = [...this.content.contentList] as StudentResponse[];
    } else if (this.url.includes('/teachers')) {
      this.teacherList = [...this.content.contentList] as TeacherResponse[];
    } else if (this.url.includes('/sequences')) {
      this.sequenceList = [...this.content.contentList] as Sequence[];
    } else if (this.url.includes('/routines')) {
      this.routineList = [...this.content.contentList] as Routine[];
    }
  }

  private observer?: IntersectionObserver;
  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;
  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.callPage();
      }
    }, { threshold: 0.1 });

    this.observer.observe(this.scrollAnchor.nativeElement);
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

      this.content.searchparams = "Buscar por " + searchParams;
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
    } else if(this.url.includes("/routines")){
      for (let routine of this.routineList) {
        routine.kind = "rutina";
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
        kind: "rutina",
        url: "/routines",
        title: "Listado de rutinas",
        subTitle: "Gestiona las rutinas de secuencias",
        gender: 0,
        plural: 1,
        searchparams: "Buscar por " + searchParams,
        sortparams: this.sortParams,
        contentList: this.routineList
      }
    } else {
      console.log("Something went wrong loading content list page data");
    }
    this.loading = false;

    // Re-observe scroll anchor to trigger infinite scroll if it's still visible
    if (this.observer && this.scrollAnchor) {
      this.observer.unobserve(this.scrollAnchor.nativeElement);
      this.observer.observe(this.scrollAnchor.nativeElement);
    }
  }

}
