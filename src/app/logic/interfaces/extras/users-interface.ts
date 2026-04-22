export interface CreateUserRequest {
    name: String,
    lastName: String,
    email: String,
    username: String,
    password: String
}
export interface UpdateUserRequest {
    name: String,
    lastName: String,
    email: String,
    username: String
}

export interface ReadUserResponse {
    id: number;
    name: string;
    lastName: string;
    email: string;
    username: string;
}