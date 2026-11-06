import { jest } from "@jest/globals";
import * as z from "zod";
import { validateRequest } from "../../middleware/validation/validate.js";

const schema = z.object({ name: z.string() });

function mockRes() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe("validateRequest", () => {
    test("calls next for valid input", () => {
        const next = jest.fn();
        validateRequest(schema, "body")({ body: { name: "a" } }, mockRes(), next);
        expect(next).toHaveBeenCalledWith();
    });

    test("400 and no next for invalid input", () => {
        const res = mockRes();
        const next = jest.fn();
        validateRequest(schema, "body")({ body: {} }, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    test("validates the requested source", () => {
        const next = jest.fn();
        validateRequest(schema, "params")({ params: { name: "a" }, body: {} }, mockRes(), next);
        expect(next).toHaveBeenCalled();
    });
});
