import { Pool } from "pg";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const DIRNAME = path.dirname(fileURLToPath(import.meta.url))
const MIGRATIONS_DIR = path.join(DIRNAME, 'migration');
const BOOTSTRAP = "000_config.sql";

export const pool = new Pool({ 
    options: "-c search_path=url_shortener_db" 
});

pool.on("error", (err) => console.error("[Database] idle client error:", err.message));

export async function migrate() {
    await pool.query(fs.readFileSync(path.join(MIGRATIONS_DIR, BOOTSTRAP), "utf-8"));

    const { rows } = await pool.query("SELECT filename FROM url_shortener_db.schema_migrations");
    const applied = new Set(rows.map(r => r.filename));
    const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter(f => f.endsWith(".sql") && f !== BOOTSTRAP)
        .sort();

    for (const file of files) {
        if (applied.has(file)) continue;

        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
        const conn = await pool.connect();
        try {
            await conn.query("BEGIN");
            await conn.query(sql);
            await conn.query("INSERT INTO url_shortener_db.schema_migrations (filename) VALUES ($1)", [file]);
            await conn.query("COMMIT");
            console.log(`[Database] applied ${file}`);
        } catch (err) {
            await conn.query("ROLLBACK");
            throw err;
        } finally {
            conn.release();
        }
    }
}
