import { request, jsonBody } from "../../../apis/client.js";

const URLS = "/api/urls";

export const shortUrlHref = (short) => `${URLS}/${short}`;

export async function getUrls() {
    const { data } = await (await request(`${URLS}/`)).json();
    return data ?? [];
}

export function createUrl(payload) {
    return request(`${URLS}/`, { method: "POST", ...jsonBody(payload) });
}

export function updateUrl(id, fields) {
    return request(`${URLS}/${id}`, { method: "PATCH", ...jsonBody(fields) });
}

export function deleteUrl(id) {
    return request(`${URLS}/${id}`, { method: "DELETE" });
}

// throws unless the code exists. redirect:"manual" stops fetch at the 302 instead of following it
// to the target site, which has no CORS headers and would reject as if the code were missing.
export async function resolveShort(short) {
    const res = await fetch(`${URLS}/${short}`, { redirect: "manual" });
    if (res.type === "opaqueredirect" || res.ok) return;
    throw new Error(`request failed with status ${res.status}`);
}
