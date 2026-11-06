import express from "express";
import asyncHandler from "express-async-handler";
import { validateRequest } from "../../middleware/validation/validate.js";
import * as inputValidation from "../../middleware/validation/authValidation.js";
import * as authController from "../../controllers/authController.js";

const router = express.Router();

router.post("/register", validateRequest(inputValidation.registerValidation, "body"), asyncHandler(async (req, res) => {
    const token = await authController.insertUserController(req.body);
    res.status(201).json({ data: token });
}));

router.post("/login", validateRequest(inputValidation.loginValidation, "body"), asyncHandler(async (req, res) => {
    const token = await authController.loginUserController(req.body);
    res.status(200).json({ data: token });
}));

export default router;
