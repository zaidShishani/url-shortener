const OPTIONAL_FIELDS = ["custom", "experationData"];

// the api rejects empty strings, so optional fields are dropped unless filled in
export function buildUrlPayload(formData) {
    const payload = { url: formData.get("url") };
    for (const field of OPTIONAL_FIELDS) {
        const value = formData.get(field);
        if (value) payload[field] = value;
    }
    return payload;
}
