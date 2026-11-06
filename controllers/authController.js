import * as authService from "../services/authServices.js"

export function insertUserController(body) {
    return authService.insertUserService(body);
}

export function loginUserController(body) {
    return authService.loginUserService(body);
}