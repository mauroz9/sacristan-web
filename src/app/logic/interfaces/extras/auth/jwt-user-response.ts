export interface JwtUserResponse {
    email: string,
    token: string,
    refreshToken: string,
    roles: string[]
}