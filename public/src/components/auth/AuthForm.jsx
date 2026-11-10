import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AuthForm({ title, onSubmit, switchTo, switchIcon, switchLabel }) {
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
            await onSubmit(Object.fromEntries(new FormData(e.target)));
        } catch (err) {
            const message = err.response?.data?.error;
            setError(typeof message === "string" ? message : "check your details and try again");
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="grid items-center md:grid-cols-2 max-w-none! py-16!">
            <Card className="w-full max-w-sm p-8 justify-self-center md:col-start-2">
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <h2>{title}</h2>
                    <Input name="username" placeholder="username" autoComplete="username" required minLength={3} maxLength={50} />
                    <Input name="password" type="password" placeholder="password" autoComplete="current-password" required minLength={8} maxLength={72} />
                    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                    <div className="flex items-center justify-between">
                        <Button asChild variant="outline" className="px-4">
                            <Link to={switchTo}><i className={`bi ${switchIcon}`}></i>{switchLabel}</Link>
                        </Button>
                        <Button className="cursor-pointer" type="submit" size="icon" disabled={busy} aria-label="submit">
                            <i className="bi bi-arrow-right "></i>
                        </Button>
                    </div>
                </form>
            </Card>
        </main>
    );
}
