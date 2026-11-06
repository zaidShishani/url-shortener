import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../app.js";
import { pool, migrate } from "../../db/dbConfig.js";

// authed client for the protected routes; plain request(app) is used where no token is wanted
const api = request.agent(app).set("Authorization", `Bearer ${jwt.sign({ id: 1 }, process.env.JWT_SECRET)}`);

beforeAll(async () => {
    await migrate();
    await pool.query("DELETE FROM urls WHERE shorten IN ('custom01', 'patchme', 'patched2', 'deleteme', 'custom02') OR url LIKE 'https://example-post-%'");
});

afterAll(() => pool.end());

async function findIdByShorten(shorten) {
    const res = await api.get("/api/urls/");
    return res.body.data.find(row => row.shorten === shorten).id;
}

describe("GET /api/urls/", () => {
    test("returns the list of all urls", async () => {
        const res = await api.get("/api/urls/");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe("POST /api/urls/", () => {
    test("creates url with generated url", async () => {
        const res = await api.post("/api/urls/").send({ url: "https://example-post-1.com" });
        expect(res.status).toBe(201);
        expect(typeof res.body.data).toBe("string");
    });

    test("creates a url with a custom short url and expiration date", async () => {
        const res = await api
            .post("/api/urls/")
            .send({ url: "https://example-post-2.com", custom: "custom01", expirationDate: "2030-01-01" });
        expect(res.status).toBe(201);
        expect(res.body.data).toBe("custom01");
    });

    test("rejects a missing url", async () => {
        const res = await api.post("/api/urls/").send({});
        expect(res.status).toBe(400);
    });

    test("rejects a invalid url", async () => {
        const res = await api.post("/api/urls/").send({ url: "not-a-url" });
        expect(res.status).toBe(400);
    });

    test("rejects a duplicate custom url", async () => {
        const res = await api
            .post("/api/urls/")
            .send({ url: "https://example-post-3.com", custom: "custom01" });
        expect(res.status).toBe(409);
        expect(res.body.error).toBe("short url already taken.");
    });
});

describe("GET /api/urls/:short", () => {
    test("redirects to the target url for a valid, non expired url", async () => {
        const res = await api.get("/api/urls/custom01");
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("https://example-post-2.com");
    });

    test("returns 404 for a short url that doesnt exist", async () => {
        const res = await api.get("/api/urls/doesnotexist");
        expect(res.status).toBe(404);
    });

    test("returns 400 for a short url over 25 characters", async () => {
        const res = await api.get("/api/urls/aaaabbbcccdddeeefffggghhiijj"); 
        expect(res.status).toBe(400);
    });
});

describe("PATCH /api/urls/:id", () => {
    let id;

    beforeAll(async () => {
        await api.post("/api/urls/").send({ url: "https://example-patch.com", custom: "patchme" });
        id = await findIdByShorten("patchme");
    });

    test("updates a single field (partial update)", async () => {
        const res = await api.patch(`/api/urls/${id}`).send({ url: "https://patched-once.com" });
        expect(res.status).toBe(204);

        const list = await api.get("/api/urls/");
        const row = list.body.data.find(r => r.id === id);
        expect(row.url).toBe("https://patched-once.com");
    });

    test("updates multiple fields at once", async () => {
        const res = await api
            .patch(`/api/urls/${id}`)
            .send({ url: "https://patched-twice.com", shorten: "patched2" });
        expect(res.status).toBe(204);

        const list = await api.get("/api/urls/");
        const row = list.body.data.find(r => r.id === id);
        expect(row.url).toBe("https://patched-twice.com");
        expect(row.shorten).toBe("patched2");
    });

    test("rejects an empty body", async () => {
        const res = await api.patch(`/api/urls/${id}`).send({});
        expect(res.status).toBe(400);
    });

    test("rejects a not an integer id", async () => {
        const res = await api.patch("/api/urls/abc").send({ url: "https://irrelevant.com" });
        expect(res.status).toBe(400);
    });

    test("returns 404 for a nonexistent id", async () => {
        const res = await api.patch("/api/urls/999999").send({ url: "https://irrelevant.com" });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("url not found");
    });
});

describe("DELETE /api/urls/:id", () => {
    let id;

    beforeAll(async () => {
        await api.post("/api/urls/").send({ url: "https://example-delete.com", custom: "deleteme" });
        id = await findIdByShorten("deleteme");
    });

    test("rejects a not an integer id", async () => {
        const res = await api.delete("/api/urls/abc");
        expect(res.status).toBe(400);
    });

    test("deletes an existing row", async () => {
        const res = await api.delete(`/api/urls/${id}`);
        expect(res.status).toBe(204);

        const list = await api.get("/api/urls/");
        expect(list.body.data.find(r => r.id === id)).toBeUndefined();
    });

    test("is idempotent when the row is already gone", async () => {
        const res = await api.delete(`/api/urls/${id}`);
        expect(res.status).toBe(204);
    });
});

describe("error handling", () => {
    test("rejects malformed JSON with 400, not 500", async () => {
        const res = await api.post("/api/urls/").set("Content-Type", "application/json").send("{bad");
        expect(res.status).toBe(400);
    });

    test("returns 409 when patching to a short url that is taken", async () => {
        await api.post("/api/urls/").send({ url: "https://example-post-dup.com", custom: "custom01" });
        await api.post("/api/urls/").send({ url: "https://example-post-dup2.com", custom: "custom02" });
        const id = await findIdByShorten("custom02");
        const res = await api.patch(`/api/urls/${id}`).send({ shorten: "custom01" });
        expect(res.status).toBe(409);
    });
});

describe("auth on protected routes", () => {
    const protectedCalls = [
        ["GET /api/urls/", () => request(app).get("/api/urls/")],
        ["POST /api/urls/", () => request(app).post("/api/urls/").send({ url: "https://example-post-noauth.com" })],
        ["PATCH /api/urls/:id", () => request(app).patch("/api/urls/1").send({ url: "https://irrelevant.com" })],
        ["DELETE /api/urls/:id", () => request(app).delete("/api/urls/1")],
    ];

    test.each(protectedCalls)("%s returns 401 without a token", async (_name, call) => {
        const res = await call();
        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Access denied. No token provided.");
    });

    test("returns 403 for an invalid token", async () => {
        const res = await request(app).get("/api/urls/").set("Authorization", "Bearer not.a.jwt");
        expect(res.status).toBe(403);
        expect(res.body.error).toBe("Invalid or expired token.");
    });

    test("returns 403 for an expired token", async () => {
        const expired = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: -10 });
        const res = await request(app).get("/api/urls/").set("Authorization", `Bearer ${expired}`);
        expect(res.status).toBe(403);
    });

    test("rejected create does not insert anything", async () => {
        const list = await api.get("/api/urls/");
        expect(list.body.data.find(r => r.url === "https://example-post-noauth.com")).toBeUndefined();
    });

    test("the redirect stays public", async () => {
        const res = await request(app).get("/api/urls/custom01");
        expect(res.status).toBe(302);
    });
});
