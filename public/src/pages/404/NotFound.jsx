import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext.jsx";

export default function NotFound() {
    const { token } = useAuth();
    return (
        <main className="not-found">
            <h2>404 — page not found</h2>
            <p>That page does not exist. If you were after a short link, try the code in the search box.</p>
            <Button asChild variant="outline" className="mt-4 px-4">
                <Link to={token ? "/urls" : "/login"}><i className="bi bi-arrow-left"></i>{token ? "back to my urls" : "back to login"}</Link>
            </Button>
        </main>
    );
}
