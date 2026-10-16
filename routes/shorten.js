import express from "express"
import * as controllerRepo from "../controllers/urlController.js"

const router = express.Router();

router.get("/", (req, res) => {
    const data = controllerRepo.getAllUlsController()
    res.status(200).json({ data: data })
});

// pass the shorten url to get the url 
router.get("/:short", (req, res) => {
    const data = controllerRepo.getUrlController(req.params.short);
    res.redirect(302, data.url);

});

// create a shorten url
// genereate a unique add
// make sure there is no duplicate shorten url
// make the route is idmponent
router.post("/", async (req, res) => {
    const r = controllerRepo.insertShortUrlController(req.body)
    res.status(r.status).json({ data: r.data } ?? { error: r.message });
});

// delete a url
router.delete("/:id", async (req, res) => {
    controllerRepo.deleteUrlController(req.params.id);
    res.sendStatus(204);
});

// udpate url 
router.patch("/:id", (req, res) => {
    const result = controllerRepo.updateUrlController(req.params.id, req.body);
    res.sendStatus(204);
});

export default router;
