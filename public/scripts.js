const API = "/urls";

const tableContainer = document.getElementById("table-container");
const deleteBtn = document.getElementById("delete-btn");
const addBtn = document.getElementById("add-btn");
const addDialog = document.getElementById("add-dialog");
const addForm = document.getElementById("add-form");
const addCancelBtn = document.getElementById("add-cancel-btn");
const deleteDialog = document.getElementById("delete-dialog");
const deleteMessage = document.getElementById("delete-message");
const deleteCancelBtn = document.getElementById("delete-cancel-btn");
const deleteConfirmBtn = document.getElementById("delete-confirm-btn");
const searchInput = document.getElementById("search-input");
const searchError = document.getElementById("search-error");

const selectedIds = new Set();

async function loadTable() {
    tableContainer.innerHTML = '<p id="loading">Loading data...</p>';
    try {
        const res = await fetch(`${API}/`);
        if (!res.ok) throw new Error(`request failed with status ${res.status}`);
        const { data } = await res.json();
        selectedIds.clear();
        updateDeleteBtn();
        renderTable(data ?? []);
    } catch (err) {
        console.log("Error calling the api for url table: ", err);
        tableContainer.innerHTML = `<p>Failed to load table: ${err.message}</p>`;
    }
}

function renderTable(rows) {
    const table = document.createElement("table");
    table.innerHTML = `
        <thead>
            <tr>
                <th></th>
                <th>URL</th>
                <th>Short code</th>
                <th></th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");
    rows.forEach(row => tbody.appendChild(buildRow(row)));
    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
}

function buildRow(row) {
    const tr = document.createElement("tr");
    tr.dataset.id = row.id;

    const checkTd = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "row-check";
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) selectedIds.add(row.id);
        else selectedIds.delete(row.id);
        updateDeleteBtn();
    });
    checkTd.appendChild(checkbox);

    const urlTd = document.createElement("td");
    urlTd.dataset.field = "url";
    urlTd.textContent = row.url;

    const shortenTd = document.createElement("td");
    shortenTd.dataset.field = "shorten";
    shortenTd.textContent = row.shorten;

    const actionTd = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
    editBtn.addEventListener("click", () => {
        if (editBtn.dataset.editing === "true") saveRow(tr, editBtn);
        else startEditRow(tr, editBtn);
    });
    actionTd.appendChild(editBtn);

    tr.append(checkTd, urlTd, shortenTd, actionTd);
    return tr;
}

function startEditRow(tr, editBtn) {
    ["url", "shorten"].forEach(field => {
        const td = tr.querySelector(`[data-field="${field}"]`);
        const input = document.createElement("input");
        input.type = "text";
        input.value = td.textContent;
        td.textContent = "";
        td.appendChild(input);
    });
    editBtn.innerHTML = '<i class="bi bi-floppy"></i>';
    editBtn.dataset.editing = "true";
}

async function saveRow(tr, editBtn) {
    const id = tr.dataset.id;
    const fields = {};
    ["url", "shorten"].forEach(field => {
        const td = tr.querySelector(`[data-field="${field}"]`);
        fields[field] = td.querySelector("input").value;
    });
    try {
        const res = await fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(fields),
        });
        if (!res.ok) throw new Error(`request failed with status ${res.status}`);
        ["url", "shorten"].forEach(field => {
            tr.querySelector(`[data-field="${field}"]`).textContent = fields[field];
        });
        editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
        delete editBtn.dataset.editing;
    } catch (err) {
        console.log("Error updating url: ", err);
        alert(`Failed to save changes: ${err.message}`);
    }
}

function updateDeleteBtn() {
    deleteBtn.disabled = selectedIds.size === 0 || selectedIds.size > 1 ;
}

deleteBtn.addEventListener("click", () => {
    deleteMessage.textContent = `Are you sure you want to delete ${selectedIds.size} item(s)? This cannot be undone.`;
    deleteDialog.showModal();
});

deleteCancelBtn.addEventListener("click", () => deleteDialog.close());

deleteConfirmBtn.addEventListener("click", async () => {
    try {
        await Promise.all([...selectedIds].map(id => fetch(`${API}/${id}`, { method: "DELETE" })));
    } catch (err) {
        console.log("Error deleting urls: ", err);
        alert(`Failed to delete some items: ${err.message}`);
    } finally {
        deleteDialog.close();
        loadTable();
    }
});

addBtn.addEventListener("click", () => {
    addForm.reset();
    addDialog.showModal();
});

addCancelBtn.addEventListener("click", () => addDialog.close());

addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(addForm);
    const payload = { url: formData.get("url") };
    const custom = formData.get("custom");
    const experationData = formData.get("experationData");
    if (custom) payload.custom = custom;
    if (experationData) payload.experationData = experationData;

    try {
        const res = await fetch(`${API}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`request failed with status ${res.status}`);
        addDialog.close();
        loadTable();
    } catch (err) {
        console.log("Error adding url: ", err);
        alert(`Failed to add url: ${err.message}`);
    }
});

searchInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    const short = searchInput.value.trim();
    searchError.textContent = "";
    if (!short) return;

    try {
        const res = await fetch(`${API}/${short}`);
        if (!res.ok) {
            searchError.textContent = "Short URL not found.";
            return;
        }
        window.location.href = `${API}/${short}`;
    } catch (err) {
        console.log("Error resolving short url: ", err);
        searchError.textContent = "Short URL not found.";
    }
});

document.addEventListener("DOMContentLoaded", loadTable);
