import { jest } from "@jest/globals";

const urlRepo = { getUrlRepo: jest.fn(), insertUrlRepo: jest.fn(), updateUrlRepo: jest.fn() };
jest.unstable_mockModule("../../repos/urlRepo.js", () => urlRepo);
const { getUrlService, insertUrlService, updateUrlService } = await import("../../services/urlServices.js");

beforeEach(() => jest.resetAllMocks());

describe("getUrlService", () => {
    test("returns the target url", async () => {
        urlRepo.getUrlRepo.mockResolvedValue({ url: "https://a.com" });
        expect(await getUrlService("abc")).toBe("https://a.com");
    });

    test("404 when the short url is unknown or expired", async () => {
        urlRepo.getUrlRepo.mockResolvedValue(undefined);
        await expect(getUrlService("abc")).rejects.toMatchObject({ statusCode: 404 });
    });
});

describe("insertUrlService", () => {
    test("uses the custom short url when given", async () => {
        expect(await insertUrlService({ url: "https://a.com", custom: "mine" })).toBe("mine");
        expect(urlRepo.insertUrlRepo).toHaveBeenCalledWith("https://a.com", "mine", undefined);
    });

    test("generates a 6 char alphanumeric short url otherwise", async () => {
        expect(await insertUrlService({ url: "https://a.com" })).toMatch(/^[A-Za-z0-9]{6}$/);
    });

    test("409 when the short url is taken", async () => {
        urlRepo.insertUrlRepo.mockRejectedValue({ code: "23505" });
        await expect(insertUrlService({ url: "https://a.com", custom: "mine" }))
            .rejects.toMatchObject({ statusCode: 409, message: "short url already taken." });
    });

    test("rethrows unexpected repo errors untouched", async () => {
        const err = new Error("boom");
        urlRepo.insertUrlRepo.mockRejectedValue(err);
        await expect(insertUrlService({ url: "https://a.com" })).rejects.toBe(err);
    });
});

describe("updateUrlService", () => {
    test("400 when no updatable field is given", async () => {
        await expect(updateUrlService(1, { other: "x" })).rejects.toMatchObject({ statusCode: 400 });
        expect(urlRepo.updateUrlRepo).not.toHaveBeenCalled();
    });

    test("passes only the provided columns to the repo", async () => {
        urlRepo.updateUrlRepo.mockResolvedValue(1);
        await updateUrlService(1, { url: "https://b.com", ignored: 1 });
        expect(urlRepo.updateUrlRepo).toHaveBeenCalledWith(1, ["url"], { url: "https://b.com", ignored: 1 });
    });

    test("404 when no row changed", async () => {
        urlRepo.updateUrlRepo.mockResolvedValue(0);
        await expect(updateUrlService(1, { url: "https://b.com" })).rejects.toMatchObject({ statusCode: 404 });
    });

    test("409 when the new short url is taken", async () => {
        urlRepo.updateUrlRepo.mockRejectedValue({ code: "23505" });
        await expect(updateUrlService(1, { shorten: "mine" })).rejects.toMatchObject({ statusCode: 409 });
    });
});
