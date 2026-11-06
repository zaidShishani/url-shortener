import { pool } from "../db/dbConfig.js";

export async function getUserRepo(username) {
    const { rows } = await pool.query("SELECT id, username, password FROM users WHERE username = $1", [username]);
    return rows[0];
}

export async function insertAUser(username, password) {
    const { rows } = await pool.query("INSERT INTO users(username, password) VALUES ($1, $2) RETURNING id", [username, password]);
    return rows[0];
}
