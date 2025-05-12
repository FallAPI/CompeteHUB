import { Request, Response, NextFunction } from 'express';
import { verifyAccesToken } from '../utils/tokenUtils';

export class middlewareAuth{
    static async AuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response |void> {
    const authHeader = req.headers['authorization'];

    const token = typeof authHeader === 'string'
    ? authHeader.split(' ')[1] 
    : null;

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const payload = verifyAccesToken(token);
        (req as any).admin = payload;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
}

} 
