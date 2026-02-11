export interface UserResponse {
    id: number,
    name: string,
    lastName: string,
    email: string,
    username: string,
}

export interface CreateUser {
    name: string,
    lastName: string,
    email: string,
    username: string,
    password: string,
    verifyPassword: string,
}

export interface UpdateUser {
    name: string,
    lastName: string,
    email: string,
    username: string
}