import { Component } from '@angular/core';
import { Sequence } from '../../interfaces/sequence-interface';

@Component({
  selector: 'app-sequence-list-page',
  imports: [],
  templateUrl: './sequence-list-page.html',
  styleUrl: './sequence-list-page.css',
})
export class SequenceListPage {
  sequenceList: Sequence[] = [
    {
      id: 1,
      title: 'Prepara la mochila',
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
}
