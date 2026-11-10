import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header/Header.jsx";
import Footer from "./components/footer/Footer.jsx";
import { RequireAuth, GuestOnly } from "./components/routes/RouteGuards.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Login from "./pages/login/Login.jsx";
import Register from "./pages/register/Register.jsx";
import UrlShortener from "./pages/urlShortener/UrlShortener.jsx";
import NotFound from "./pages/404/NotFound.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Header />
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route element={<GuestOnly />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Route>
                    <Route element={<RequireAuth />}>
                        <Route path="/urls" element={<UrlShortener />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </AuthProvider>
        </BrowserRouter>
    );
}
