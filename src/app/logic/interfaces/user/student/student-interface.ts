import { TeacherResponse } from "../teacher/teacher-interface";
import { UserResponse } from "../user-interface";

export interface StudentResponse extends UserResponse {
    kind: 'student',
    role: String,
    teacher: TeacherResponse
}

export interface StudentResponsePaginated {
    content: StudentResponse[],
    page: Page
}

export interface Page {
    number: number,
    size: number,
    totalElements: number,
    totalPages: number
}