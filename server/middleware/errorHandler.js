class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 404;
        this.name = "NotFoundError";
    }
}

const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== 'test') console.error(err.stack);
    const message = err.message || "Internal Server Error";
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({error: message});
}
export {NotFoundError, errorHandler};
