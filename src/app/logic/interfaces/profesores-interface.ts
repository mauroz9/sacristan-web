// Response DTOs
export interface ReadTeacherResponse {
    id: number;
    name: string;
    lastName: string;
    email: string;
    username: string;
}

export interface TeacherListResponse {
    id: number;
    name: string;
    lastName: string;
    studentCount: number;
}

export interface AssignedStudentResponse {
    id: number;
    name: string;
    lastName: string;
    email: string;
}

export interface UnAssignedStudentResponse {
    id: number;
    name: string;
    lastName: string;
}
