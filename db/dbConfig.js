import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const DIRNAME = path.dirname(fileURLToPath(import.meta.url))
const DBDIR = path.join(DIRNAME, "../DB_Store");
const MIGRATIONS_DIR = path.join(DIRNAME, 'migration');

const db = new Database(path.join(DBDIR,"url-shortener"));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON')

function migrate() {
    const current = db.pragma('user_version', {simple: true})
    const files = fs.readdirSync(MIGRATIONS_DIR).sort();

    for(const file of files) {
        const version = parseInt(file,10)
        if(version <= current) continue; 

        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
        db.transaction(() => {
            db.exec(sql);
            db.pragma(`user_version = ${version}`);
        })();
    }
}

migrate();

process.on('exit', () => db.close());
console.log("[Database] connected successfully");

export default db;
