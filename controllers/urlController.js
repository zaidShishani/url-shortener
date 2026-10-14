import * as urlRepo from "../repos/urlRepo.js";
import * as urlService from "../services/urlServices.js";

export function getUrlController(shorten) {
    return urlRepo.getUrlRepo(shorten);
}

export function insertShortUrl(url, shorten, experationData) {
    return urlService.insertUrlService(url, shorten, experationData);
}

export function deleteUrlController(id) {
    return urlRepo.deleteUrlRepo(id);
}
