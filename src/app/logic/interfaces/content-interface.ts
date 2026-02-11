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
    searchparams?: string,
    sortparams? : SortParam[],
    contentList: (Sequence | StudentResponse | TeacherResponse)[]
}

export interface SortParam {
    key: string,
    value: string
}