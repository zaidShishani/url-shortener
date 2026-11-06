export class AppError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export function errorHandler(err, req, res, next) {
    const status = err.statusCode ?? err.status ?? 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ error: status >= 500 ? "internal server error" : err.message });
}

export default AppError;
