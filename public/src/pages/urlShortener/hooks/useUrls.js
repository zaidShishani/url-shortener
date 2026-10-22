import { useCallback, useEffect, useState } from "react";
import * as urlsApi from "../apis/urlsApi.js";

export function useUrls() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const reload = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            setRows(await urlsApi.getUrls());
        } catch (err) {
            console.log("Error calling the api for url table: ", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { reload(); }, [reload]);

    const addUrl = useCallback(async (payload) => {
        await urlsApi.createUrl(payload);
        await reload();
    }, [reload]);

    const saveUrl = useCallback(async (id, fields) => {
        await urlsApi.updateUrl(id, fields);
        setRows(rs => rs.map(r => r.id === id ? { ...r, ...fields } : r));
    }, []);

    const removeUrls = useCallback(async (ids) => {
        try {
            await Promise.all(ids.map(urlsApi.deleteUrl));
        } finally {
            await reload();
        }
    }, [reload]);

    return { rows, loading, error, reload, addUrl, saveUrl, removeUrls };
}
