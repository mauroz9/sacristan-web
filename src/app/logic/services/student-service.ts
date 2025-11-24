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
      name: 'Juan',
      lastName: 'Pérez',
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

  deleteStudent(studentId: number | undefined) {
    const index = this.studentList.findIndex(s => s.id === studentId)
    if(index !== -1){
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
      this.studentList[id-1] = newStudent;
    } else {
      this.studentList.push(newStudent);
    }

  }
    
  
}
