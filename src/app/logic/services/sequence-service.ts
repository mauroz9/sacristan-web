import { Injectable } from '@angular/core';
import { Sequence } from '../interfaces/sequence-interface';

@Injectable({
  providedIn: 'root',
})
export class SequenceService {
  
  sequenceList: Sequence [] = [
    {
      kind: "secuencia",
      id: 1,
      title: 'Prepara la mochila',
      description: 'Elementos necesarios para el colegio',
      categorie: 'Colegio',
      steps: [
        { id: 1, order: 1, description: 'Abrir mochila', imageUrl: 'https://api.arasaac.org/api/pictograms/2347' },
        { id: 2, order: 2, description: 'Meter libros', imageUrl: 'https://api.arasaac.org/api/pictograms/2350' },
        { id: 3, order: 3, description: 'Meter estuche', imageUrl: 'https://api.arasaac.org/api/pictograms/2350' },
        { id: 4, order: 4, description: 'Cerrar mochila', imageUrl: 'https://api.arasaac.org/api/pictograms/2350' },
        { id: 5, order: 5, description: 'Ponerse mochila', imageUrl: 'https://api.arasaac.org/api/pictograms/2350' }
      ]
    },
    {
      kind: "secuencia",
      id: 2,
      title: 'Lavarse las manos',
      description: 'Higiene antes de comer',
      categorie: 'Higiene',
      steps: [
        { id: 6, order: 1, description: 'Mojar manos', imageUrl: 'https://api.arasaac.org/api/pictograms/2347' },
        { id: 7, order: 2, description: 'Poner jabón', imageUrl: 'https://api.arasaac.org/api/pictograms/2347' },
        { id: 8, order: 3, description: 'Frotar', imageUrl: 'https://api.arasaac.org/api/pictograms/2347' }
      ]
    }
  ];

  getSequences(): Sequence[]{
    return this.sequenceList;
  }

  getSequenceById(id: number): Sequence | undefined {
    return this.sequenceList.find(s => s.id === id);
  }

  addSequence(newSequence: Sequence){
    newSequence.id = this.sequenceList.length + 1;
    this.sequenceList.push(newSequence);
  }

  modifySequence(modifySequence: Sequence){
    const index = this.sequenceList.findIndex(s => s.id === modifySequence.id);
    if (index !== -1) {
      this.sequenceList[index] = modifySequence;
    }
  }

  deleteSequence(id: number){
    const index = this.sequenceList.findIndex(s => s.id === id)
    if(index !== -1){
      this.sequenceList.splice(index, 1)
    }
  }
}
