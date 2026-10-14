import express from "express"

const router = express();

// pass the shorten url to get the url 
router.get("/:url", (req, res) => {

});

// create a shorten url
// genereate a unique add
// make sure there is no duplicate shorten url
router.post("/url", (req, res) => {

});

// delete a url
router.delete("/:id", (req, res) => {

});

// udpate url 
router.patch("/:id", (req, res) => {

});