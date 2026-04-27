// Response DTOs
export interface TeacherListResponse {
    id: number;
    name: string;
    lastName: string;
    studentCount: number;
    kind: 'profesor';
}

export interface AssignedStudentResponse {
    id: number;
    name: string;
    lastName: string;
    email: string;
    teacherId: number;
}

export interface UnAssignedStudentResponse {
    id: number;
    name: string;
    lastName: string;
}
