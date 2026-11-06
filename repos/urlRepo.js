import { pool } from "../db/dbConfig.js";

export async function getAllUrlsRepo() {
    const { rows } = await pool.query("SELECT id, url, shorten FROM urls");
    return rows;
}

export async function getUrlRepo(shorten) {
    const { rows } = await pool.query(
        `UPDATE urls SET views = views + 1
         WHERE shorten = $1 AND (expiration_date IS NULL OR expiration_date > CURRENT_TIMESTAMP)
         RETURNING url`,
        [shorten]);
    return rows[0];
}

export async function insertUrlRepo(url, shorten, expirationDate) {
    await pool.query(
        "INSERT INTO urls(url, shorten, expiration_date) VALUES ($1, $2, $3)",
        [url, shorten, expirationDate]);
}

export async function deleteUrlRepo(id) {
    const { rowCount } = await pool.query("DELETE FROM urls WHERE id = $1", [id]);
    return rowCount;
}

const COLUMN = { url: "url", shorten: "shorten", expirationDate: "expiration_date" };

export async function updateUrlRepo(id, cols, fields) {
    const sets = cols.map((c, i) => `${COLUMN[c]} = $${i + 1}`).join(", ");
    const { rowCount } = await pool.query(
        `UPDATE urls SET ${sets}, updated_at = CURRENT_TIMESTAMP WHERE id = $${cols.length + 1}`,
        [...cols.map(c => fields[c]), id]);
    return rowCount;
}
