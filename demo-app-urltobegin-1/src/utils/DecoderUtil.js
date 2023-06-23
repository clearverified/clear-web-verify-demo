import jwt_decode from "jwt-decode";

export function decodeToken(token){
    return jwt_decode(token);
}