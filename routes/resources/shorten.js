import express from "express";
import asyncHandler from "express-async-handler";
import { validateRequest } from "../../middleware/validation/validate.js";
import * as inputValidation from "../../middleware/validation/shortenValidation.js"
import * as urlController from "../../controllers/urlController.js";
import auth from "../../middleware/auth/authHandler.js";

const router = express.Router();

router.get("/", auth, asyncHandler(async (req, res) => {
    const data = await urlController.getAllUlsController()
    res.status(200).json({ data: data })
}));

// pass the shorten url to get the url 
router.get("/:short", validateRequest(inputValidation.shortValidation, "params"), asyncHandler(async (req, res) => {
    res.redirect(302, await urlController.getUrlController(req.params.short));
}));

// create a shorten url
// genereate a unique add
// make sure there is no duplicate shorten url
// make the route is idmponent
router.post("/", auth, validateRequest(inputValidation.bodyPostValidation, "body"), asyncHandler(async (req, res) => {
    res.status(201).json({ data: await urlController.insertShortUrlController(req.body) });
}));

// delete a url
router.delete("/:id", auth, validateRequest(inputValidation.idValidation, "params"), asyncHandler(async (req, res) => {
    await urlController.deleteUrlController(req.params.id);
    res.sendStatus(204);
}));

// udpate url 
router.patch("/:id",
    auth,
    validateRequest(inputValidation.idValidation, "params"),
    validateRequest(inputValidation.bodyPatchValidation, "body"),
    asyncHandler(async (req, res) => {
    await urlController.updateUrlController(req.params.id, req.body);
    res.sendStatus(204);
}));

export default router;
