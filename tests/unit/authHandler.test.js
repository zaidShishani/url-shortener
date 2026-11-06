import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import auth from "../../middleware/auth/authHandler.js";

process.env.JWT_SECRET = "unit-test-secret";

const run = (authorization) => {
    const req = { headers: authorization === undefined ? {} : { authorization } };
    const next = jest.fn();
    auth(req, {}, next);
    return { req, next };
};

describe("authHandler", () => {
    test("401 when there is no authorization header", () => {
        const { next } = run();
        expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 401 });
    });

    test("401 when the header has no token part", () => {
        const { next } = run("Bearer");
        expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 401 });
    });

    test("403 for a garbage token", () => {
        const { next } = run("Bearer not.a.jwt");
        expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 403 });
    });

    test("403 for a token signed with another secret", () => {
        const { next } = run(`Bearer ${jwt.sign({ id: 1 }, "other-secret")}`);
        expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 403 });
    });

    test("403 for an expired token", () => {
        const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: -10 });
        const { next } = run(`Bearer ${token}`);
        expect(next.mock.calls[0][0]).toMatchObject({ statusCode: 403 });
    });

    test("valid token sets req.user and calls next with no error", () => {
        const { req, next } = run(`Bearer ${jwt.sign({ id: 7 }, process.env.JWT_SECRET)}`);
        expect(req.user).toMatchObject({ id: 7 });
        expect(next).toHaveBeenCalledWith();
    });
});
