import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app.js";
import { pool, migrate } from "../../db/dbConfig.js";

process.env.SALT = "4"; // .env uses a production-grade cost; keep the tests fast

const USER = { username: "itest_alice", password: "password123" };

beforeAll(async () => {
    await migrate();
    await pool.query("DELETE FROM users WHERE username LIKE 'itest_%'");
});

afterAll(async () => {
    await pool.query("DELETE FROM users WHERE username LIKE 'itest_%'");
    await pool.end();
});

describe("POST /api/auth/register", () => {
    test("creates the user and returns a token carrying the new user id", async () => {
        const res = await request(app).post("/api/auth/register").send(USER);
        expect(res.status).toBe(201);

        const { rows } = await pool.query("SELECT id, password FROM users WHERE username = $1", [USER.username]);
        expect(jwt.verify(res.body.data, process.env.JWT_SECRET).id).toBe(rows[0].id);
        expect(rows[0].password).not.toBe(USER.password);
    });

    test("rejects a duplicate username with 409", async () => {
        const res = await request(app).post("/api/auth/register").send(USER);
        expect(res.status).toBe(409);
        expect(res.body.error).toBe("username already taken.");
    });

    test.each([
        ["a missing password", { username: "itest_bob" }],
        ["a too short username", { username: "ab", password: "password123" }],
        ["a username over 50 chars", { username: "itest_" + "x".repeat(50), password: "password123" }],
        ["a too short password", { username: "itest_bob", password: "short" }],
    ])("rejects %s with 400", async (_name, body) => {
        const res = await request(app).post("/api/auth/register").send(body);
        expect(res.status).toBe(400);
    });
});

describe("POST /api/auth/login", () => {
    test("returns a working token for correct credentials", async () => {
        const res = await request(app).post("/api/auth/login").send(USER);
        expect(res.status).toBe(200);

        const urls = await request(app).get("/api/urls/").set("Authorization", `Bearer ${res.body.data}`);
        expect(urls.status).toBe(200);
    });

    test("rejects a wrong password with 401", async () => {
        const res = await request(app).post("/api/auth/login").send({ ...USER, password: "wrong-password" });
        expect(res.status).toBe(401);
        expect(res.body.error).toBe("invalid username or password");
    });

    test("rejects an unknown user with the same 401 message", async () => {
        const res = await request(app).post("/api/auth/login").send({ username: "itest_nobody", password: "password123" });
        expect(res.status).toBe(401);
        expect(res.body.error).toBe("invalid username or password");
    });

    test("rejects a missing body with 400", async () => {
        const res = await request(app).post("/api/auth/login").send({});
        expect(res.status).toBe(400);
    });
});
