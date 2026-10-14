import * as repo from "../repos/urlRepo";

export async function getUrlController(url) {
    return repo.getUrlRepo(url);
}