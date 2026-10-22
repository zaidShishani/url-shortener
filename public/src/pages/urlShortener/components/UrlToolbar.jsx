export default function UrlToolbar({ search, canDelete, onAdd, onDelete }) {
    return (
        <div className="toolbar">
            <div className="toolbar-left">
                <input
                    type="text"
                    placeholder="Enter short code and press Enter"
                    value={search.short}
                    onChange={e => search.setShort(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && search.submit()}
                />
                <span className="error-text">{search.error}</span>
            </div>
            <div className="toolbar-right">
                <button disabled={!canDelete} onClick={onDelete}>
                    <i className="bi bi-trash"></i> Delete
                </button>
                <button onClick={onAdd}>
                    <i className="bi bi-plus-lg"></i> Add URL
                </button>
            </div>
        </div>
    );
}
