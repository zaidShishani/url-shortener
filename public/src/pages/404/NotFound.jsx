import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <main className="not-found">
            <h2>404 — page not found</h2>
            <p>That page does not exist. If you were after a short link, try the code in the search box.</p>
            <Link to="/">Back to TLTL</Link>
        </main>
    );
}
