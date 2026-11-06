import jwt from "jsonwebtoken";
import AppError from "../../libs/errorhandler.js";

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return next(new AppError(401, "Access denied. No token provided."));

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        next(new AppError(403, "Invalid or expired token."));
    }
};

export default auth;
