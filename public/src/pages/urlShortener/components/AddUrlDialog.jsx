import { useDialog } from "../../../hooks/useDialog.js";
import { buildUrlPayload } from "../utils/payload.js";

export default function AddUrlDialog({ open, onClose, onSubmit }) {
    const ref = useDialog(open);

    async function submit(e) {
        e.preventDefault();
        const form = e.target;
        try {
            await onSubmit(buildUrlPayload(new FormData(form)));
            form.reset();
            onClose();
        } catch (err) {
            console.log("Error adding url: ", err);
            alert(`Failed to add url: ${err.message}`);
        }
    }

    return (
        <dialog ref={ref} onClose={onClose}>
            <form onSubmit={submit}>
                <h3>Add new URL</h3>
                <label>URL<input type="url" name="url" required /></label>
                <label>Custom short code (optional)<input type="text" name="custom" /></label>
                <label>Expiration date (optional)<input type="date" name="experationData" /></label>
                <div className="dialog-actions">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="submit">Save</button>
                </div>
            </form>
        </dialog>
    );
}
