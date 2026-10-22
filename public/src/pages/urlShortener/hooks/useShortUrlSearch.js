import { useState } from "react";
import * as urlsApi from "../apis/urlsApi.js";

export function useShortUrlSearch() {
    const [short, setShort] = useState("");
    const [error, setError] = useState("");

    async function submit() {
        const code = short.trim();
        setError("");
        if (!code) return;
        try {
            await urlsApi.resolveShort(code);
            window.location.href = urlsApi.shortUrlHref(code);
        } catch (err) {
            console.log("Error resolving short url: ", err);
            setError("Short URL not found.");
        }
    }

    return { short, setShort, error, submit };
}
