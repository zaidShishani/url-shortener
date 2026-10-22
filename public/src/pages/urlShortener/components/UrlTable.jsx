import { useState } from "react";

const FIELDS = ["url", "shorten"];

export default function UrlTable({ rows, selectedIds, onToggleSelected, onSave }) {
    const [editing, setEditing] = useState(null);
    async function save() {
        const { id, ...fields } = editing;
        try {
            await onSave(id, fields);
            setEditing(null);
        } catch (err) {
            console.log("Error updating url: ", err);
            alert(`Failed to save changes: ${err.message}`);
        }
    }

    return (
        <table>
            <thead>
                <tr><th></th><th>URL</th><th>Short code</th><th></th></tr>
            </thead>
            <tbody>
                {rows.map(row => {
                    const isEditing = editing?.id === row.id;
                    return (
                        <tr key={row.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(row.id)}
                                    onChange={e => onToggleSelected(row.id, e.target.checked)}
                                />
                            </td>
                            {FIELDS.map(field => (
                                <td key={field}>
                                    {isEditing
                                        ? <input
                                            type="text"
                                            value={editing[field]}
                                            onChange={e => setEditing({ ...editing, [field]: e.target.value })}
                                          />
                                        : row[field]}
                                </td>
                            ))}
                            <td>
                                <button
                                    className="edit-btn"
                                    onClick={() => isEditing ? save() : setEditing({ id: row.id, url: row.url, shorten: row.shorten })}
                                >
                                    <i className={isEditing ? "bi bi-floppy" : "bi bi-pencil"}></i>
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
