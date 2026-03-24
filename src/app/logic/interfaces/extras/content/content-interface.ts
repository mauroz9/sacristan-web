import { StudentListResponse } from "../../alumnos-interface"

export interface Content {
    kind:string,
    url: string,
    title: string,
    subTitle: string,
    gender: number,
    plural?: number,
    searchparams?: string,
    sortparams? : SortParam[],
    contentList: (StudentListResponse)[]
}

export interface SortParam {
    key: string,
    value: string
}