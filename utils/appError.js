



class AppError extends Error {
    constructor() {
        super()
    }
    static create(message, statusCode, statusText) {
        const error = new AppError()
        error.message = message;
        error.statusCode = statusCode;
        error.statusText = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';;
        return  error;
    }
}

module.exports = AppError