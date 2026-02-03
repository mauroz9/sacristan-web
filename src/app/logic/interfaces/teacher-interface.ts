import { UserResponse } from "./user/user-interface";

export interface Teacher {
    kind: 'profesor',
    id?: number,
    user: UserResponse
}