import { jest } from "@jest/globals";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET = "unit-test-secret";
process.env.SALT = "3";

const authRepo = { insertAUser: jest.fn(), getUserRepo: jest.fn() };
jest.unstable_mockModule("../../repos/authRepo.js", () => authRepo);
const { insertUserService, loginUserService } = await import("../../services/authServices.js");

beforeEach(() => jest.resetAllMocks());

describe("insertUserService", () => {
    test("stores a hashed password and returns a token for the new user", async () => {
        authRepo.insertAUser.mockResolvedValue({ id: 5 });
        const token = await insertUserService({ username: "alice", password: "password123" });

        const [username, stored] = authRepo.insertAUser.mock.calls[0];
        expect(username).toBe("alice");
        expect(stored).not.toBe("password123");
        expect(await bcrypt.compare("password123", stored)).toBe(true);
        expect(jwt.verify(token, process.env.JWT_SECRET)).toMatchObject({ id: 5 });
    });

    test("409 when the username is taken", async () => {
        authRepo.insertAUser.mockRejectedValue({ code: "23505" });
        await expect(insertUserService({ username: "alice", password: "password123" }))
            .rejects.toMatchObject({ statusCode: 409 });
    });

    test("rethrows unexpected repo errors untouched", async () => {
        const err = new Error("connection lost");
        authRepo.insertAUser.mockRejectedValue(err);
        await expect(insertUserService({ username: "alice", password: "password123" })).rejects.toBe(err);
    });
});

describe("loginUserService", () => {
    const password = "password123";
    let user;
    beforeAll(async () => { user = { id: 9, username: "bob", password: await bcrypt.hash(password, 4) }; });

    test("returns a token for correct credentials", async () => {
        authRepo.getUserRepo.mockResolvedValue(user);
        const token = await loginUserService({ username: "bob", password });
        expect(jwt.verify(token, process.env.JWT_SECRET)).toMatchObject({ id: 9 });
    });

    test("401 for an unknown user", async () => {
        authRepo.getUserRepo.mockResolvedValue(undefined);
        await expect(loginUserService({ username: "nobody", password })).rejects.toMatchObject({ statusCode: 401 });
    });

    test("401 for a wrong password, with the same message as an unknown user", async () => {
        authRepo.getUserRepo.mockResolvedValue(user);
        const wrong = await loginUserService({ username: "bob", password: "wrong-password" }).catch(e => e);
        authRepo.getUserRepo.mockResolvedValue(undefined);
        const unknown = await loginUserService({ username: "nobody", password }).catch(e => e);
        expect(wrong.statusCode).toBe(401);
        expect(wrong.message).toBe(unknown.message);
    });
});
