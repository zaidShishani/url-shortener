import express from "express"
import authApi from "./resources/auth.js"
import shrotenApis from "./resources/shorten.js";

const router = express.Router();

router.use("/auth", authApi);
router.use('/urls', shrotenApis);


export default router