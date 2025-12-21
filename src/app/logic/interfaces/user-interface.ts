export interface User {
    id: number,
    name: string,
    last_name: string,
    email: string,
    role_id: number
    password?: string,
    password_confirmation?: string
}