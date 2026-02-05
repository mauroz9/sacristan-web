import { UserResponse } from "../user-interface";

export interface TeacherResponse extends UserResponse {
    kind: 'profesor',
    role: String,
    teacher: TeacherResponse

}