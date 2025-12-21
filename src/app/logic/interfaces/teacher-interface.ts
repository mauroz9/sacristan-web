import { User } from "./user-interface";

export interface Teacher {
    kind: 'profesor',
    id?: number,
    user: User
}