import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { nombre, email, password, rol } = req.body;

            if (!nombre || !email || !password) {
                res.status(400).json({ message: 'Nombre, email y password son requeridos' });
                return;
            }

            const result = await authService.register({
                nombre,
                email,
                password_hash: password,
                rol
            });

            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: 'Email y password son requeridos' });
                return;
            }

            const result = await authService.login(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }
}
