const OPTIONAL_FIELDS = ["custom", "expirationDate"];

export function buildUrlPayload(formData) {
    const payload = { url: formData.get("url") };
    for (const field of OPTIONAL_FIELDS) {
        const value = formData.get(field);
        if (value) payload[field] = value;
    }
    return payload;
}
