import { UserResponse } from "../user-interface";

export interface TeacherResponse extends UserResponse {
    kind: 'teacher',
    role: String,
    teacher: TeacherResponse

}