import { createContext, useContext, useState } from "react";
import { clearToken, getToken, setToken } from "../apis/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setTokenState] = useState(getToken);

    const login = (value) => {
        setToken(value);
        setTokenState(value);
    };

    const logout = () => {
        clearToken();
        setTokenState(null);
    };

    return <AuthContext value={{ token, login, logout }}>{children}</AuthContext>;
}

export const useAuth = () => useContext(AuthContext);
