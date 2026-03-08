import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        rol: string;
    };
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET || 'supersecret_zapatoflex_key', (err: any, user: any) => {
            if (err) {
                res.status(403).json({ message: 'Token invalido o expirado' });
                return;
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'Token de autorizacion requerido' });
    }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.rol === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado: se requieren privilegios de Administrador' });
    }
};
