import { useState } from "react";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.jsx";
import UrlToolbar from "./components/UrlToolbar.jsx";
import UrlTable from "./components/UrlTable.jsx";
import AddUrlDialog from "./components/AddUrlDialog.jsx";
import { useUrls } from "./hooks/useUrls.js";
import { useShortUrlSearch } from "./hooks/useShortUrlSearch.js";
import "./styles/urlShortener.css";

export default function UrlShortener() {
    const { rows, loading, error, addUrl, saveUrl, removeUrls } = useUrls();
    const search = useShortUrlSearch();
    const [selectedIds, setSelectedIds] = useState([]);
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    function toggleSelected(id, checked) {
        setSelectedIds(ids => checked ? [...ids, id] : ids.filter(i => i !== id));
    }

    async function deleteSelected() {
        try {
            await removeUrls(selectedIds);
        } catch (err) {
            console.log("Error deleting urls: ", err);
            alert(`Failed to delete some items: ${err.message}`);
        } finally {
            setDeleteOpen(false);
            setSelectedIds([]);
        }
    }

    return (
        <>
            <main>
                <UrlToolbar
                    search={search}
                    canDelete={selectedIds.length === 1}
                    onAdd={() => setAddOpen(true)}
                    onDelete={() => setDeleteOpen(true)}
                />

                {loading ? <p>Loading data...</p>
                    : error ? <p>Failed to load table: {error}</p>
                    : <UrlTable
                        rows={rows}
                        selectedIds={selectedIds}
                        onToggleSelected={toggleSelected}
                        onSave={saveUrl}
                      />}
            </main>

            <AddUrlDialog open={addOpen} onClose={() => setAddOpen(false)} onSubmit={addUrl} />
            <ConfirmDialog
                open={deleteOpen}
                message={`Are you sure you want to delete ${selectedIds.length} item(s)? This cannot be undone.`}
                confirmLabel="Delete"
                onClose={() => setDeleteOpen(false)}
                onConfirm={deleteSelected}
            />
        </>
    );
}
