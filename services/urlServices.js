import * as urlRepo from "../repos/urlRepo.js";
import AppError from "../libs/errorhandler.js";
import { randomBytes } from "crypto";

function generateShortUrl() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const byte = randomBytes(6);
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars[byte[i] % chars.length];
    }
    return result;
}

export async function getUrlService(shorten) {
    const row = await urlRepo.getUrlRepo(shorten);
    if (!row) throw new AppError(404, "url not found");
    return row.url;
}

export async function insertUrlService(fields) {
    const { url, custom, expirationDate } = fields;
    const shorten = custom ?? generateShortUrl();
    try {
        await urlRepo.insertUrlRepo(url, shorten, expirationDate);
    } catch (err) {
        throw err.code === "23505" ? new AppError(409, "short url already taken.") : err;;
    }
    return shorten;
}

export async function updateUrlService(id, fields) {
    const update = ["url", "shorten", "expirationDate"];
    const cols = update.filter(f => fields[f] !== undefined);
    if (!cols.length) throw new AppError(400, "url not changed");
    let changed;
    try {
        changed = await urlRepo.updateUrlRepo(id, cols, fields);
    } catch (err) {
        throw err.code === "23505" ? new AppError(409, "short url already taken.") : err;;
    }
    if (!changed) throw new AppError(404, "url not found");
    
}

