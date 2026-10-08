export function globalErrorHandler(err, req, res, next) {
    const statusCode = err?.statusCode || err?.cause || 500;
    const message = err?.message || 'Something went wrong';

    if (err?.isOperational === true || typeof err?.statusCode === 'number') {
        return res.status(statusCode).json({
            success: false,
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        });
    }

    console.error(err);

    return res.status(500).json({
        success: false,
        error: 'Something went wrong',
    });
}