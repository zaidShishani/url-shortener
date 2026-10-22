import { useDialog } from "../../hooks/useDialog.js";

export default function ConfirmDialog({ open, message, confirmLabel = "Confirm", onClose, onConfirm }) {
    const ref = useDialog(open);

    return (
        <dialog ref={ref} onClose={onClose}>
            <p>{message}</p>
            <div className="dialog-actions">
                <button type="button" onClick={onClose}>Cancel</button>
                <button type="button" onClick={onConfirm}>{confirmLabel}</button>
            </div>
        </dialog>
    );
}
