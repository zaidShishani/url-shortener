import * as urlRepo from "../repos/urlRepo.js";
import * as urlService from "../services/urlServices.js";

export function getAllUlsController() {
    return urlRepo.getAllUrlsRepo();
}

export function getUrlController(shorten) {
    return urlService.getUrlService(shorten);
}

export function insertShortUrlController(fields) {
    return urlService.insertUrlService(fields);
}

export function deleteUrlController(id) {
    return urlRepo.deleteUrlRepo(id);
}

export function updateUrlController(id, fields) {
    return urlService.updateUrlService(id, fields);
}
