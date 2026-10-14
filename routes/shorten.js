import express from "express"
import * as controllerRepo from "../controllers/urlController.js"

const router = express.Router();

// pass the shorten url to get the url 
router.get("/:short", (req, res) => {
    const { short } = req.params;
    const data = controllerRepo.getUrlController(short);
    res.redirect(302, data);

});

// create a shorten url
// genereate a unique add
// make sure there is no duplicate shorten url
// make the route is idmponent
router.post("/url", async(req, res) => {
        controllerRepo.insertShortUrl(url, shorten, experationData)
        res.sendStatus(201)
});

// delete a url
router.delete("/:id", async(req, res) => {
        const { id } = req.params;
        await controllerRepo.deleteUrlController(id);
        res.sendStatus(204);
});

// udpate url 
router.patch("/:id", (req, res) => {

});

export default router;
