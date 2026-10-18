import db from "../db/dbConfig.js";

export function getAllUrlsRepo() {
    const sql = db.prepare(`
            SELECT id, url, shorten from urls;
        `).all();
    return sql
}

export function getUrlRepo(shorten) {
    const sql = db.prepare(`
            SELECT url from urls where shorten = ? AND (expirationDate IS NULL OR expirationDate > CURRENT_TIMESTAMP);
        `).get(shorten);
    return sql;
}

export function insertUrlRepo(url, shorten, expirationDate) {
    const sql = db.prepare(`
            INSERT INTO urls(url, shorten, expirationDate) VALUES (?,?,?);
        `).run(url, shorten, expirationDate);
    return sql;
}

export function deleteUrlRepo(id) {
    const sql = db.prepare(`
            DELETE FROM urls WHERE id = ?;
    `).run(id);
    return sql;
}


export function updateUrlRepo(id, cols, fields) {
    const sql = db.prepare(`
            UPDATE urls SET ${cols.map(c =>`${c} = ?`).join(',')}, updateAT = CURRENT_TIMESTAMP where id = ?;
        `).run(...cols.map(f => fields[f]), id);
    return sql;
}
