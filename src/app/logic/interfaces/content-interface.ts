import { Sequence } from "./sequence-interface";
import { TeacherResponse } from "./user/teacher/teacher-interface";
import { StudentResponse } from "./user/student/student-interface";
export interface Content {
    kind:string,
    url: string,
    title: string,
    subTitle: string,
    gender: number,
    plural?: number,
    contentList: (Sequence | StudentResponse | TeacherResponse)[]
}