export interface JwtUserResponse {
    id: number,
    name: string,
    lastName: string,
    email: string,
    username: string,
    token: string
    refreshToken: string
    roles: string[]
}