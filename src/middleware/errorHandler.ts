import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import {ApiError} from '../utils/ApiError';

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    if(err instanceof MulterError ){
        if( err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size exceeds 30MB limit '});
        }

        if (err.code === 'LIMIT_UNEXPECTED_FILE' && err.message.includes('Only')) {
            return res.status(400).json({ error: err.message || 'Unexpected file format' });
        }
        return res.status(400).json({ error: 'File upload error' });
    }

    if(err instanceof ApiError){
        return res.status(err.statusCode).json({ error: err.message});
    }

    if(err instanceof Error){
        console.error('Unhandled error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(500).json({ error: 'Unknown error'});
};