import * as authRepo from "../repos/authRepo.js";
import AppError from "../libs/errorhandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UNIQUE_VIOLATION = "23505";

function tokenGen(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
}

export async function insertUserService({ username, password }) {
    const hash = await bcrypt.hash(password, Number(process.env.SALT));
    try {
        const user = await authRepo.insertAUser(username, hash);
        return tokenGen(user.id);
    } catch (err) {
        if (err.code === UNIQUE_VIOLATION) throw new AppError(409, "username already taken.");
        throw err;
    }
}

export async function loginUserService({ username, password }) {
    const user = await authRepo.getUserRepo(username);
    console.log("user")
    const check = bcrypt.compare(password, user.password)
    if (!user || !check) {
        console.log("am i here ? ")
        throw new AppError(401, "invalid username or password");
    }
    return tokenGen(user.id);
}
