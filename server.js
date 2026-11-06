import app from "./app.js";
import { migrate } from "./db/dbConfig.js";

const PORT = 4040;

await migrate();
console.log("[Database] migrations up to date");

app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
});
