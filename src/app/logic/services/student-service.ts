import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student-interface';
import { Content } from '../interfaces/content-interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {

  getStudentById(studentId: number): Student {
    for (let student of this.studentList) {
      if (student.id === studentId) {
        return student;
      }
    }
    throw new Error('Student not found');
  }

  studentList: Student[] = [
    {
      kind: 'alumno',
      id: 1,
      name: 'Lucía',
      lastName: 'Fernández Morales',
      grade: '2º Ciclo Educación Infantil (3-6 años)',
      assignedSequences: 4
    },
    {
      kind: 'alumno',
      id: 2,
      name: 'Carlos',
      lastName: 'Sánchez Ruiz',
      grade: '1º Ciclo F.B.O. (6-10 años)',
      assignedSequences: 6
    },
    {
      kind: 'alumno',
      id: 3,
      name: 'Elena',
      lastName: 'Martín Pérez',
      grade: '1º Ciclo F.B.O. (6-10 años)',
      assignedSequences: 3
    },
    {
      kind: 'alumno',
      id: 4,
      name: 'Javier',
      lastName: 'Gómez Ortega',
      grade: '2º Ciclo F.B.O. (10-13 años)',
      assignedSequences: 8
    },
    {
      kind: 'alumno',
      id: 5,
      name: 'Sara',
      lastName: 'Navarro León',
      grade: '2º Ciclo F.B.O. (10-13 años)',
      assignedSequences: 5
    },
    {
      kind: 'alumno',
      id: 6,
      name: 'David',
      lastName: 'Ruiz Castellano',
      grade: '3º Ciclo F.B.O. (14-16 años)',
      assignedSequences: 7
    },
    {
      kind: 'alumno',
      id: 7,
      name: 'Paula',
      lastName: 'Torres López',
      grade: '3º Ciclo F.B.O. (14-16 años)',
      assignedSequences: 9
    },
    {
      kind: 'alumno',
      id: 8,
      name: 'Hugo',
      lastName: 'Vega Santana',
      grade: 'Proyecto Interdisciplinar 1º Ciclo (16-18 años)',
      assignedSequences: 10
    },
    {
      kind: 'alumno',
      id: 9,
      name: 'Andrea',
      lastName: 'Iglesias Romero',
      grade: 'Proyecto Interdisciplinar 2º Ciclo (18-21 años)',
      assignedSequences: 11
    },
    {
      kind: 'alumno',
      id: 10,
      name: 'Óscar',
      lastName: 'Delgado Herrera',
      grade: '2º Ciclo Educación Infantil (3-6 años)',
      assignedSequences: 2
    }

  ];

  contentAlumno: Content = {
    kind: "alumno",
    url: "/students",
    title: "Listado de alumnos",
    subTitle: "Gestiona los alumnos del centro",
    gender: 1,
    contentList: this.studentList
  }

  deleteStudent(studentId: number | undefined) {
    const index = this.studentList.findIndex(s => s.id === studentId)
    if (index !== -1) {
      this.studentList.splice(index, 1)
    }
  }

  addStudent(newStudentData: any) {
    let id

    if (newStudentData.id) {
      id = newStudentData.id;
    } else {
      id = this.studentList.length + 1;
    }

    const newStudent: Student = {
      kind: 'alumno',
      id: id,
      name: `${newStudentData.nameFormControl}`,
      lastName: `${newStudentData.lastNameFormControl}`,
      grade: newStudentData.gradeFormControl,
      assignedSequences: 0
    };

    if (newStudentData.id) {
      this.studentList[id - 1] = newStudent;
    } else {
      this.studentList.push(newStudent);
    }

  }


}
