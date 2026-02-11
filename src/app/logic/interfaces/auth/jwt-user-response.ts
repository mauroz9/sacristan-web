import { UserResponse } from "../user/user-interface";

export interface JwtUserResponse extends UserResponse {
    token: string,
    refreshToken: string,
    roles: string[]
}