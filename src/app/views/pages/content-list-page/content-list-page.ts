import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ContentListComponent } from '../../components/content-list/content-list-component/content-list-component';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoadingComponent } from '../../components/shared/loading-component/loading-component';
import { SequenceListResponse } from '../../../logic/interfaces/secuencias-interface';
import { StudentListResponse } from '../../../logic/interfaces/alumnos-interface';
import { TeacherListResponse } from '../../../logic/interfaces/profesores-interface';
import { RoutineListResponse } from '../../../logic/interfaces/rutinas-interface';
import { Content, SortParam } from '../../../logic/interfaces/extras/content/content-interface';
import { AlumnosService } from '../../../logic/services/alumnos-service';
import { ProfesoresService } from '../../../logic/services/profesores-service';
import { SecuenciasService } from '../../../logic/services/secuencias-service';
import { RutinasService } from '../../../logic/services/rutinas-service';
import { QuerySortParameters } from '../../../logic/interfaces/extras/utils/sort-params-interface';

@Component({
  selector: 'app-content-list-page',
  standalone: true,
  imports: [ContentListComponent, LoadingComponent],
  templateUrl: './content-list-page.html',
  styleUrl: './content-list-page.css',
})
export class ContentListPage implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private alumnosService: AlumnosService,
    private profesoresService: ProfesoresService,
    private secuenciasService: SecuenciasService,
    private rutinasService: RutinasService
  ) { }

  url = "";

  sequenceList: SequenceListResponse[] = [];
  studentList: StudentListResponse[] = []
  teacherList: TeacherListResponse[] = [];
  routineList: RoutineListResponse[] = [];
  sortParams: SortParam[] = [];
  infoMessage: string | null = null;
  errorMessage: string | null = null;
  page = 0;
  isLoading = false;
  allLoaded = false;
  currentQuery = '';
  currentSortBy = '';
  currentSortDir = 'asc';

  content: Content = {
    kind: "secuencia",
    url: "/sequences",
    title: "Secuencia de pasos",
    subTitle: "Gestiona las secuencias de pictogramas para los estudiantes",
    searchparams: "Buscar por título o descripción",
    gender: 0,
    contentList: []
  };
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

    try {
      this.url = this.router.url;
      if (this.url.includes('/students')) {
        this.studentList = (await firstValueFrom(this.alumnosService.list())).content;
        console.log(this.studentList);
        
        this.sortParams = await firstValueFrom(this.alumnosService.getSortParams());
        
      } else if (this.url.includes('/teachers')) {
        this.teacherList = (await firstValueFrom(this.profesoresService.list())).content;
        this.sortParams = await firstValueFrom(this.profesoresService.getSortParams());
      } else if (this.url.includes('/sequences')) {
        this.sequenceList = (await firstValueFrom(this.secuenciasService.list())).content;
        this.sortParams = await firstValueFrom(this.secuenciasService.getSortParams());
      } else if(this.url.includes('/routines')){
        this.routineList = (await firstValueFrom(this.rutinasService.list())).content;
        this.sortParams = await firstValueFrom(this.rutinasService.getSortParams());
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
    var res: StudentListResponse[] | TeacherListResponse[] | SequenceListResponse[] | RoutineListResponse[] = [];
    if (this.isLoading || this.allLoaded) return;
    this.isLoading = true;
    
    this.page++;  
    this.url = this.router.url;

      const params: QuerySortParameters = {
        page: this.page,
        query: this.currentQuery,
        sortBy: this.currentSortBy || undefined,
        sortDir: this.currentSortDir
      };

      if (this.url.includes('/students')) {

        res = (await firstValueFrom(this.alumnosService.list(params))).content;

        if(res.length == 0){
          this.allLoaded = true;
        } else {
          console.log(res);
          this.studentList.push(...(res as StudentListResponse[]));
        }

      } else if (this.url.includes('/teachers')) {

        res = (await firstValueFrom(this.profesoresService.list(params))).content;

        if(res.length == 0){
          this.allLoaded = true;
        } else {
          console.log(res);
          this.teacherList.push(...(res as TeacherListResponse[]));
        }

      } else if (this.url.includes('/sequences')) {
        res = (await firstValueFrom(this.secuenciasService.list(params))).content;

        if(res.length == 0){
          this.allLoaded = true;
        } else {
          console.log(res);
          this.sequenceList.push(...(res as SequenceListResponse[]));
        }
      } else if(this.url.includes('/routines')){
        res = (await firstValueFrom(this.rutinasService.list(params))).content
        if(res.length == 0){
          this.allLoaded = true;
        } else {
          console.log(res);
          this.routineList.push(...(res as RoutineListResponse[]));
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
    this.loadData();
  }

  @ViewChild('scrollAnchor') scrollAnchor!: ElementRef;
  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.callPage();
      }
    }, { threshold: 0.1 });

    observer.observe(this.scrollAnchor.nativeElement);
  }

  loadData() {
    if (this.url.includes('/sequences')) {
      const sequencesWithKind = this.sequenceList.map(seq => ({ ...seq, kind: "sequence" as SequenceListResponse["kind"] }));

      this.content = {
        kind: "sequence",
        url: "/sequences",
        title: "Secuencia de pasos",
        subTitle: "Gestiona las secuencias de pictogramas para los estudiantes",
        gender: 0,
        searchparams: "Buscar por título o descripción",
        sortparams: this.sortParams,
        contentList: sequencesWithKind as SequenceListResponse[]
      };

    } else if (this.url.includes('/students')) {
      const studentsWithKind = this.studentList.map(student => ({ ...student, kind: "student" as StudentListResponse["kind"] }));

      this.content = {
        kind: "student",
        url: "/students",
        title: "Listado de alumnos",
        subTitle: "Gestiona los alumnos del centro",
        gender: 1,
        searchparams: "Buscar por nombre, apellido",
        sortparams: this.sortParams,
        contentList: studentsWithKind as StudentListResponse[]
      };

    } else if (this.url.includes('/teachers')) {
      const teachersWithKind = this.teacherList.map(teacher => ({ ...teacher, kind: "teacher" as TeacherListResponse["kind"] }));

      this.content = {
        kind: "teacher",
        url: "/teachers",
        title: "Listado de profesores",
        subTitle: "Gestiona los profesores del centro",
        gender: 1,
        plural: 1,
        searchparams: "Buscar por nombre, apellido",
        sortparams: this.sortParams,
        contentList: teachersWithKind as TeacherListResponse[]
      };

    } else if (this.url.includes("/routines")) {
      const routinesWithKind = this.routineList.map(routine => ({ ...routine, kind: "routine" as any }));

      this.content = {
        kind: "routine",
        url: "/routines",
        title: "Listado de rutinas",
        subTitle: "Gestiona las rutinas de secuencias",
        gender: 0,
        plural: 1,
        searchparams: "Buscar por nombre",
        sortparams: this.sortParams,
        contentList: routinesWithKind as any
      };

    } else {
      console.log("Something went wrong loading content list page data");
    }

    console.log("Contenido cargado:");
    console.log(this.content);
    

    this.loading = false;
  }

}
