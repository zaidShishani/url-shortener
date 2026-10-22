export async function request(path, options) {
    const res = await fetch(path, options);
    if (!res.ok) throw new Error(`request failed with status ${res.status}`);
    return res;
}

export const jsonBody = (body) => ({
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
});
