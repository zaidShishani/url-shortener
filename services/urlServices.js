import * as urlRepo from "../repos/urlRepo.js";
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

export function getUrlService(shorten) {
    const data = urlRepo.getUrlRepo(shorten);
    if(!data) return ({ status: 404, message: "url not found" })
}

export function insertUrlService(fields) {
    const { url, custom, experationData } = fields;
    if (custom && urlRepo.getUrlRepo(custom)) {
        return { status: 409, message: "short url already taken." };
    }
    const shorten = custom ?? generateShortUrl();
    urlRepo.insertUrlRepo(url, shorten, experationData);
    return { status: 201, data: shorten };
}

export function updateUrlService(id, fields) {
    const update = ["url", "shorten", "expirationDate"];
    const cols = update.filter(f => fields[f] !== undefined);
    if (!cols.length) return { status: 400, message: "url not changed"};
    const change = urlRepo.updateUrlRepo(id, cols, fields);
    return change.changes > 0 ? { status: 204 } : { status: 404, message: "url not found" };
}
