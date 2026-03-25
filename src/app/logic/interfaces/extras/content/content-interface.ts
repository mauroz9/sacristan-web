import { StudentListResponse } from "../../alumnos-interface"
import { TeacherListResponse } from "../../profesores-interface"
import { SequenceListResponse } from "../../secuencias-interface"
import { RoutineListResponse } from "../../rutinas-interface"

export type ContentItem = StudentListResponse | TeacherListResponse | SequenceListResponse | RoutineListResponse

export interface Content {
    kind:string,
    url: string,
    title: string,
    subTitle: string,
    gender: number,
    plural?: number,
    searchparams?: string,
    sortparams? : SortParam[],
    contentList: ContentItem[]
}

export interface SortParam {
    key: string,
    value: string
}