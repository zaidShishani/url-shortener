import request from "supertest";
import app from "../app.js";

async function findIdByShorten(shorten) {
    const res = await request(app).get("/urls/");
    return res.body.data.find(row => row.shorten === shorten).id;
}

describe("GET /urls/", () => {
    test("returns the list of all urls", async () => {
        const res = await request(app).get("/urls/");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });
});

describe("POST /urls/", () => {
    test("creates url with generated url", async () => {
        const res = await request(app).post("/urls/").send({ url: "https://example-post-1.com" });
        expect(res.status).toBe(201);
        expect(typeof res.body.data).toBe("string");
    });

    test("creates a url with a custom short url and expiration date", async () => {
        const res = await request(app)
            .post("/urls/")
            .send({ url: "https://example-post-2.com", custom: "custom01", experationData: "2030-01-01" });
        expect(res.status).toBe(201);
        expect(res.body.data).toBe("custom01");
    });

    test("rejects a missing url", async () => {
        const res = await request(app).post("/urls/").send({});
        expect(res.status).toBe(400);
    });

    test("rejects a invalid url", async () => {
        const res = await request(app).post("/urls/").send({ url: "not-a-url" });
        expect(res.status).toBe(400);
    });

    test("rejects a duplicate custom url", async () => {
        const res = await request(app)
            .post("/urls/")
            .send({ url: "https://example-post-3.com", custom: "custom01" });
        expect(res.status).toBe(409);
        expect(res.body.error).toBe("short url already taken.");
    });
});

describe("GET /urls/:short", () => {
    test("redirects to the target url for a valid, non expired url", async () => {
        const res = await request(app).get("/urls/custom01");
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("https://example-post-2.com");
    });

    test("returns 404 for a short url that doesnt exist", async () => {
        const res = await request(app).get("/urls/doesnotexist");
        expect(res.status).toBe(404);
    });

    test("returns 400 for a short url over 25 characters", async () => {
        const res = await request(app).get("/urls/aaaabbbcccdddeeefffggghhiijj"); 
        expect(res.status).toBe(400);
    });
});

describe("PATCH /urls/:id", () => {
    let id;

    beforeAll(async () => {
        await request(app).post("/urls/").send({ url: "https://example-patch.com", custom: "patchme" });
        id = await findIdByShorten("patchme");
    });

    test("updates a single field (partial update)", async () => {
        const res = await request(app).patch(`/urls/${id}`).send({ url: "https://patched-once.com" });
        expect(res.status).toBe(204);

        const list = await request(app).get("/urls/");
        const row = list.body.data.find(r => r.id === id);
        expect(row.url).toBe("https://patched-once.com");
    });

    test("updates multiple fields at once", async () => {
        const res = await request(app)
            .patch(`/urls/${id}`)
            .send({ url: "https://patched-twice.com", shorten: "patched2" });
        expect(res.status).toBe(204);

        const list = await request(app).get("/urls/");
        const row = list.body.data.find(r => r.id === id);
        expect(row.url).toBe("https://patched-twice.com");
        expect(row.shorten).toBe("patched2");
    });

    test("rejects an empty body", async () => {
        const res = await request(app).patch(`/urls/${id}`).send({});
        expect(res.status).toBe(400);
    });

    test("rejects a not an integer id", async () => {
        const res = await request(app).patch("/urls/abc").send({ url: "https://irrelevant.com" });
        expect(res.status).toBe(400);
    });

    test("returns 404 for a nonexistent id", async () => {
        const res = await request(app).patch("/urls/999999").send({ url: "https://irrelevant.com" });
        expect(res.status).toBe(404);
        expect(res.body.error).toBe("url not found");
    });
});

describe("DELETE /urls/:id", () => {
    let id;

    beforeAll(async () => {
        await request(app).post("/urls/").send({ url: "https://example-delete.com", custom: "deleteme" });
        id = await findIdByShorten("deleteme");
    });

    test("rejects a not an integer id", async () => {
        const res = await request(app).delete("/urls/abc");
        expect(res.status).toBe(400);
    });

    test("deletes an existing row", async () => {
        const res = await request(app).delete(`/urls/${id}`);
        expect(res.status).toBe(204);

        const list = await request(app).get("/urls/");
        expect(list.body.data.find(r => r.id === id)).toBeUndefined();
    });

    test("is idempotent when the row is already gone", async () => {
        const res = await request(app).delete(`/urls/${id}`);
        expect(res.status).toBe(204);
    });
});
