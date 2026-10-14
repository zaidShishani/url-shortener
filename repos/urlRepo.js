import db from "../db/dbConfig.js";


export function getUrlRepo(shorten) {
    const sql = db.prepare(`
            SELECT url from urls where shorten = ?;
        `).get(shorten);
    const url = sql.run();
    if (!url.ok) {
        console.log('[ERROR] getUrl query failed: ', err);
        throw new Error;
    }
    return url;
}

export function insertUrlRepo(url, shorten, expirationDate) {
    const sql = db.prepare(`
            INSERT INTO urls(url, shorten, expirationDate) VALUES (?,?,?);
        `).run(url, shorten, expirationDate);
    const insert = sql.run();
    if (!insert) {
        console.log('[ERROR] insertUurl query failed: ', err);
        throw new Error
    };
    return insert;
}

export function deleteUrlRepo(id) {
    const sql = db.prepare(`
            DELETE FROM url WHERE id = ?;
    `).get(id);


}

export function updateUrlRepo(url, shorten, expirationDate) {
    const sql = db.prepare(`
    
        `);
}
