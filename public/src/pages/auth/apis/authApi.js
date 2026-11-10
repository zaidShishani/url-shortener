import { api } from "../../../apis/client.js";

const AUTH = "/api/auth";

export const loginUser = async (credentials) => (await api.post(`${AUTH}/login`, credentials)).data.data;

export const registerUser = async (credentials) => (await api.post(`${AUTH}/register`, credentials)).data.data;
