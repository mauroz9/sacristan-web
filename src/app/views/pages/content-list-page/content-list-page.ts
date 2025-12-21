import { Component, OnInit } from '@angular/core';
import { Content } from '../../../logic/interfaces/content-interface';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
import { ContentListComponent } from '../../components/content-list/content-list-component/content-list-component';
import { Router } from '@angular/router';
import { StudentService } from '../../../logic/services/student-service';
import { SequenceService } from '../../../logic/services/sequence-service';
import { Student } from '../../../logic/interfaces/student-interface';


@Component({
  selector: 'app-content-list-page',
  imports: [ContentListComponent],
  templateUrl: './content-list-page.html',
  styleUrl: './content-list-page.css',
})
export class ContentListPage implements OnInit {

  url = "";

  sequenceList: Sequence[] = [];
  studentList: Student[] = []
  infoMessage: string | null = null;

  contentSequence: Content = {
    kind: "secuencia",
    url: "/sequences",
    title: "Secuencia de pasos",
    subTitle: "Gestiona las secuencias de pictogramas para los estudiantes",
    gender: 0,
    contentList: this.sequenceList
  }

  content: Content = this.contentSequence;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private sequenceService: SequenceService
  ) {
  }

  reloadContent() {
    this.getData();

    this.infoMessage = localStorage.getItem('infoMessage');
    if (this.infoMessage) {
      localStorage.removeItem('infoMessage');
    }
  }

  ngOnInit(): void {
    this.reloadContent();
  }

  getData() {
    this.url = this.router.url;
    if (this.url.includes('/sequences')) {
      this.loadData();
    } else if (this.url.includes('/students')) {
      this.studentService.getStudent().subscribe({
        next: (data) => {
          this.studentList = data;          
          this.loadData()
        }
      });
    }
  }

  loadData() {
    this.sequenceService.getSequences().subscribe({
      next: (data) => {
        this.sequenceList = data;
        this.contentSequence.contentList = this.sequenceList;

        if (this.url.includes('/sequences')) {
          this.content = this.contentSequence;
        } else if (this.url.includes('/students')) {

          for (let student of this.studentList) {
            student.kind = "alumno";
          }

          this.content = {
            kind: "alumno",
            url: "/students",
            title: "Listado de alumnos",
            subTitle: "Gestiona los alumnos del centro",
            gender: 1,
            contentList: this.studentList
          }
        } else if (this.url.includes('/teachers')) {
          this.content = {
            kind: "profesor",
            url: "/teachers",
            title: "Listado de profesores",
            subTitle: "Gestiona los profesores del centro",
            gender: 1,
            plural: 1,
            contentList: []
          }
        }
      });
  }

}
