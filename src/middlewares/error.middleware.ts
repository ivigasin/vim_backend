import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
    err: any, 
    req: Request,
    res: Response, 
    next:NextFunction
): void => {
    console.error(err);

    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        status: 'error',
        statusCode: status,
        message,
    });
}