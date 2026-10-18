import * as z from "zod";

//validator middlare
export const validateRequest = (schema, source = "body") => (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
        return res.status(400).json({ error: result.error });
    }
    next()
}

//inputs validations
export const idValidation = z.object({
    id: z.coerce.number().int().positive()
})

export const shortValidation = z.object({
    short: z.string().max(25)
})

export const bodyPatchValidation = z.object({
    url: z.url().optional(),
    shorten: z.string().max(25).optional(),
    expirationDate: z.iso.date().optional()
}).refine(data => Object.keys(data).length > 0, {
    error: "at least one field must be provided"
})

export const bodyPostValidation = z.object({
    url: z.url(),
    shorten: z.string().max(25).optional(),
    expirationDate: z.iso.date().optional()
})
