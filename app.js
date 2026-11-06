import express from "express";
import logger from "morgan";
import apis from "./routes/apis.js"
import { errorHandler } from "./libs/errorhandler.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(logger('dev'));

app.use('/api', apis);

app.use(express.static(path.join(DIRNAME, "dist")));
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(DIRNAME, "dist", "index.html"));
});

app.use(errorHandler);

export default app;
