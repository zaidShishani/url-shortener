import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { loginUser } from "../auth/apis/authApi.js";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    async function submit(credentials) {
        login(await loginUser(credentials));
        navigate("/urls");
    }

    return <AuthForm title="login" onSubmit={submit} switchTo="/register" switchIcon="bi-person-plus" switchLabel="create account" />;
}
