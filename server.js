import express from "express";
import logger from "morgan";
import route from "./routes/shorten.js"
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = 4040;
const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(logger('dev'));

app.use('/url', route);

app.use(express.static(path.join(DIRNAME, "public")));

app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
});
