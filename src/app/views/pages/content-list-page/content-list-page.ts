import { Component } from '@angular/core';
import { ContentListComponent } from "../../components/content-list-component/content-list-component";
import { Content, Student } from '../../../logic/interfaces/content-interface';
import { Sequence } from '../../../logic/interfaces/sequence-interface';
@Component({
  selector: 'app-sequence-list-page',
  imports: [ContentListComponent],
  templateUrl: './content-list-page.html',
  styleUrl: './content-list-page.css',
})
export class ContentListPage {


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

  studentList: Student[] = [];


  contentSequence: Content = {
    kind: "secuencia",
    title: "Secuencia de pasos",
    subTitle: "Gestiona las secuencias de pictogramas para los estudiantes",
    gender: 0,
    contentList: this.sequenceList
  }

  contentAlumno: Content = {
    kind: "alumno",
    title: "Listado de alumnos",
    subTitle: "Gestiona los alumnos del centro",
    gender: 1,
    contentList: this.studentList
  }

  content = this.contentSequence;

}
