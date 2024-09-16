import { ErrorRequestHandler } from 'express';

import { Logs } from '../const.js';
import { Logger } from '../services/index.js';

export function handleError(): ErrorRequestHandler {
    return (error, req, res, _next) => {
        Logger.error(
            Logs.error.apiRequest
                .replaceAll('{HTTP_METHOD}', req.method)
                .replaceAll('{URL}', req.url),
            error
        );
        res.status(500).json({ error: true, message: error.message });
    };
}
