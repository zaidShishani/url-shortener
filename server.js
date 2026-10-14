import express from "express";
import route from "./routes/shorten.js"
const app = express();
const PORT = 4040;

app.use(express.json());

app.use('/url', route);

app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
});
