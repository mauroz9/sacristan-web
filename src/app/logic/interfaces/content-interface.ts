import { Sequence } from "./sequence-interface";
import { Student } from "./student-interface";

export interface Content {
    kind:string,
    title: string,
    subTitle: string,
    gender: number,
    contentList: (Sequence | Student)[]
}