import db from "../db/dbConfig";


export async function getUrlRepo(url) {
    const sql = `
        SELECT url from urls where shorten = ?;
    `;
}

export async function insertUrlRepo(url, shorten, expirationDate) {
    const sql = `
        INSERT INTO urls(url, shorten, expirationDate) VALUES (?,?,?);
    `
}

export async function updateUrlRepo(url, shorten, expirationDate) {
    const sql = `

    `
}

export async function deleteUrlRepo(id) {
    const sql = `
        DELETE FROM url WHERE id = ?;
    `
}