import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <h1><Link to="/">TLTL</Link></h1>
            <p>Too Long To Link<br />shorten, manage and share your URLs.</p>
        </header>
    );
}
