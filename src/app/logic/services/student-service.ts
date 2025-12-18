import { Injectable } from '@angular/core';
import { backStudent, Student } from '../interfaces/student-interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  addStudent(formData: any) {
    console.log(formData);
  }

  // studentList: Student[] = [
  //   {
  //     kind: 'alumno',
  //     id: 1,
  //     name: 'Lucía',
  //     lastName: 'Fernández Morales',
  //     assignedSequences: 4
  //   },
  //   {
  //     kind: 'alumno',
  //     id: 2,
  //     name: 'Carlos',
  //     lastName: 'Sánchez Ruiz',
  //     assignedSequences: 6
  //   },
  //   {
  //     kind: 'alumno',
  //     id: 3,
  //     name: 'Elena',
  //     lastName: 'Martín Pérez',
  //     assignedSequences: 3
  //   },
  //   {
  //     kind: 'alumno',
  //     id: 4,
  //     name: 'Javier',
  //     lastName: 'Gómez Ortega',
  //     assignedSequences: 8
  //   },
  //   {
  //     kind: 'alumno',
  //     id: 5,
  //     name: 'Sara',
  //     lastName: 'Navarro León',
  //     assignedSequences: 5
  //   },
  //   {
  //     kind: 'alumno',
  //     id: 6,
  //     name: 'David',
  //     lastName: 'Ruiz Castellano',
  //     assignedSequences: 7
  //   },
  //   {
  //     kind: 'alumno',
  //     id: 7,
  //     name: 'Paula',
  //     lastName: 'Torres López',
  //     assignedSequences: 9
  //   },
  //   {
  //     kind: 'alumno',
  //     id: 8,
  //     name: 'Hugo',
  //     lastName: 'Vega Santana',
  //     grade: 'Proyecto Interdisciplinar 1º Ciclo (16-18 años)',
  //     assignedSequences: 10
  //   },
  //   {
  //     kind: 'alumno',
  //     id: 9,
  //     name: 'Andrea',
  //     lastName: 'Iglesias Romero',
  //     grade: 'Proyecto Interdisciplinar 2º Ciclo (18-21 años)',
  //     assignedSequences: 11
  //   },
  //   {
  //     kind: 'alumno',
  //     id: 10,
  //     name: 'Óscar',
  //     lastName: 'Delgado Herrera',
  //     grade: '2º Ciclo Educación Infantil (3-6 años)',
  //     assignedSequences: 2
  //   }

  // ];

  constructor (private http:HttpClient) {

  }

  getStudent(): Observable<backStudent[]> {
    return this.http.get<backStudent[]>("http://127.0.0.1:8000/api/usuarios")
  }



}
