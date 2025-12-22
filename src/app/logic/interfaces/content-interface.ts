import { Sequence } from "./sequence-interface";
import { Student } from "./student-interface";
import { Teacher } from "./teacher-interface";
export interface Content {
    kind:string,
    url: string,
    title: string,
    subTitle: string,
    gender: number,
    plural?: number,
    contentList: (Sequence | Student | Teacher)[]
}