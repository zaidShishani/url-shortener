import * as z from "zod"

export const registerValidation = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(8).max(72)
})

export const loginValidation = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(8).max(72)
})
