import { Sequence } from "./sequence-interface";

export interface Content {
    kind:string,
    title: string,
    subTitle: string,
    gender: number,
    contentList: (Sequence | Student)[]
}

export interface Student { // Temporal
    kind: 'alumno',
    id: number,
    name: string,
    grade: string,
    assignedSequences: number
}