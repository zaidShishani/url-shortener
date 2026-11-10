import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { registerUser } from "../auth/apis/authApi.js";

export default function Register() {
    const { login } = useAuth();
    const navigate = useNavigate();

    async function submit(credentials) {
        login(await registerUser(credentials));
        navigate("/urls");
    }

    return <AuthForm title="register" onSubmit={submit} switchTo="/login" switchIcon="bi-box-arrow-in-right" switchLabel="sign in instead" />;
}
