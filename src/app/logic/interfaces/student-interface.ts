import { User } from "./user-interface";

export interface Student { // Temporal
    kind: 'alumno',
    id?: number,
    user: User,
    teacher?: User,
}