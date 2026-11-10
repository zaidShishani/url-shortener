import { api } from "../../../apis/client.js";

const URLS = "/api/urls";

export const shortUrlHref = (short) => `${URLS}/${short}`;

export async function getUrls() {
    const { data } = await api.get(`${URLS}/`);
    return data.data ?? [];
}

export function createUrl(payload) {
    return api.post(`${URLS}/`, payload);
}

export function updateUrl(id, fields) {
    return api.patch(`${URLS}/${id}`, fields);
}

export function deleteUrl(id) {
    return api.delete(`${URLS}/${id}`);
}

export async function resolveShort(short) {
    const res = await fetch(`${URLS}/${short}`, { redirect: "manual" });
    if (res.type === "opaqueredirect" || res.ok) return;
    throw new Error(`request failed with status ${res.status}`);
}
