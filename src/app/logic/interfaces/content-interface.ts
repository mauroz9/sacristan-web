import { Sequence } from "./sequence-interface";

export interface Content {
    kind:String,
    title: String,
    subTitle: String,
    gender: Number,
    contentList : (Sequence| Student) []
}

export interface Student {
    kind: 'alumno',
    id: Number,
    name: String,
    grade: String,
    assignedSequences: Number
}