import * as urlRepo from "../repos/urlRepo.js";


export function insertUrlService(url, shorten, experationData) {
    const checkDuplicate = urlRepo.getUrlRepo(shorten)
    if (checkDuplicate) throw new Error("shorten url exists");

    const insert = urlRepo.insertUrlRepo(url, shorten, experationData);
    return insert;    
}

export function updateUrlService(url, shorten, experationData) {
    
}