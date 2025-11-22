import { Component } from '@angular/core';
import { Content } from '../../../logic/interfaces/content-interface';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
import { ContentListComponent } from '../../components/content-list/content-list-component/content-list-component';
import { Student } from '../../../logic/interfaces/student-interface';
import { Router } from '@angular/router';
import { StudentService } from '../../../logic/services/student-service';


@Component({
  selector: 'app-content-list-page',
  imports: [ContentListComponent],
  templateUrl: './content-list-page.html',
  styleUrl: './content-list-page.css',
})
export class ContentListPage {

  url = "";

  sequenceList: Sequence[] = [
    {
      kind: "secuencia",
      id: 1,
      title: 'Prepara la mochilas',
      description: 'Elementos necesarios para el colegio',
      steps: [
        { id: 1, order: 1, description: 'Abrir mochila', imageUrl: '...' },
        { id: 2, order: 2, description: 'Meter libros', imageUrl: '...' },
        { id: 3, order: 3, description: 'Meter estuche', imageUrl: '...' },
        { id: 4, order: 4, description: 'Cerrar mochila', imageUrl: '...' },
        { id: 5, order: 5, description: 'Ponerse mochila', imageUrl: '...' }
      ],
      categorie: 'Colegio'
    },
    {
      kind: "secuencia",
      id: 2,
      title: 'Lavarse las manos',
      description: 'Higiene antes de comer',
      steps: [
        { id: 6, order: 1, description: 'Mojar manos', imageUrl: '...' },
        { id: 7, order: 2, description: 'Poner jabón', imageUrl: '...' },
        { id: 8, order: 3, description: 'Frotar', imageUrl: '...' }
      ],
      categorie: 'Higiene'
    }
  ];

  contentSequence: Content = {
    kind: "secuencia",
    url: "/sequences",
    title: "Secuencia de pasos",
    subTitle: "Gestiona las secuencias de pictogramas para los estudiantes",
    gender: 0,
    contentList: this.sequenceList
  }

  content: Content = this.contentSequence;

  constructor(private router: Router, private studentService: StudentService) {
    this.url = this.router.url;
    if(this.url.includes('sequences')){
      this.content = this.contentSequence;
    } else if(this.url.includes('students')){
      this.content = this.studentService.contentAlumno;
    }
  }
}
