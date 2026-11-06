import { jest } from "@jest/globals";
import AppError, { errorHandler } from "../../libs/errorhandler.js";

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("AppError", () => {
    test("carries the status code and message and is an Error", () => {
        const err = new AppError(404, "nope");
        expect(err).toBeInstanceOf(Error);
        expect(err.statusCode).toBe(404);
        expect(err.message).toBe("nope");
    });
});

describe("errorHandler", () => {
    beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
    afterEach(() => jest.restoreAllMocks());

    test("sends an AppError's status and message", () => {
        const res = mockRes();
        errorHandler(new AppError(409, "taken"), {}, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ error: "taken" });
        expect(console.error).not.toHaveBeenCalled();
    });

    test("uses `status` from body-parser style errors", () => {
        const res = mockRes();
        errorHandler(Object.assign(new Error("bad json"), { status: 400 }), {}, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "bad json" });
    });

    test("hides the message of unexpected errors and logs them", () => {
        const res = mockRes();
        const err = new Error("db password is hunter2");
        errorHandler(err, {}, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "internal server error" });
        expect(console.error).toHaveBeenCalledWith(err);
    });

    test("hides the message of an explicit 5xx AppError too", () => {
        const res = mockRes();
        errorHandler(new AppError(503, "upstream detail"), {}, res, jest.fn());
        expect(res.status).toHaveBeenCalledWith(503);
        expect(res.json).toHaveBeenCalledWith({ error: "internal server error" });
    });
});
