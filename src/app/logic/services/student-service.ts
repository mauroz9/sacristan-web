import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student-interface';
import { Content } from '../interfaces/content-interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {

  studentList: Student[] = [
    {
      kind: 'alumno',
      id: 1,
      name: 'Juan Pérez',
      grade: '3º de Primaria',
      assignedSequences: 5
    },
  ];

  contentAlumno: Content = {
    kind: "alumno",
    url: "/students",
    title: "Listado de alumnos",
    subTitle: "Gestiona los alumnos del centro",
    gender: 1,
    contentList: this.studentList
  }

  addStudent(newStudentData: any) {
    const newStudent: Student = {
      kind: 'alumno',
      id: this.studentList.length + 1,
      name: `${newStudentData.nameFormControl} ${newStudentData.lastNameFormControl}`,
      grade: newStudentData.gradeFormControl,
      assignedSequences: 0
    };
    this.studentList.push(newStudent);
  }
    
  
}
