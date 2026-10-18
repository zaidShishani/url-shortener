import express from "express";
import * as middleware from "../middleware/validate.js";
import * as controllerRepo from "../controllers/urlController.js";

const router = express.Router();

router.get("/", (req, res) => {
    const data = controllerRepo.getAllUlsController()
    res.status(200).json({ data: data })
});

// pass the shorten url to get the url 
router.get("/:short", middleware.validateRequest(middleware.shortValidation, "params"), (req, res) => {
    const data = controllerRepo.getUrlController(req.params.short);
    if(!data) return res.sendStatus(404);
    res.redirect(302, data.url);

});

// create a shorten url
// genereate a unique add
// make sure there is no duplicate shorten url
// make the route is idmponent
router.post("/", middleware.validateRequest(middleware.bodyPostValidation, "body"), (req, res) => {
    const r = controllerRepo.insertShortUrlController(req.body)
    res.status(r.status).json(r.data !== undefined ? { data: r.data } : { error: r.message });
});

// delete a url
router.delete("/:id", middleware.validateRequest(middleware.idValidation, "params"), (req, res) => {
    controllerRepo.deleteUrlController(req.params.id);
    res.sendStatus(204);
});

// udpate url 
router.patch("/:id", 
    middleware.validateRequest(middleware.idValidation, "params"),
    middleware.validateRequest(middleware.bodyPatchValidation, "body"),
    (req, res) => {
    const r = controllerRepo.updateUrlController(req.params.id, req.body);
    res.status(r.status).json(r.data !== undefined ? { data: r.data } : { error: r.message });
});

export default router;
