import { startTransition } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    function signOut() {
        startTransition(() => {
            navigate("/login");
            logout();
        });
    }

    return (
        <header>
            <h1><Link to="/">TLTL</Link></h1>
            <p>Too Long To Link<br />shorten, manage and share your URLs.</p>
            {token && (
                <Button variant="outline" className="absolute top-4 right-4 px-4 cursor-pointer" onClick={signOut}>
                    <i className="bi bi-box-arrow-right "></i>log out
                </Button>
            )}
        </header>
    );
}
