import { TeacherResponse } from "../teacher/teacher-interface";
import { UserResponse } from "../user-interface";

export interface StudentResponse extends UserResponse {
    kind: 'alumno',
    role: String,
    teacher: TeacherResponse
}