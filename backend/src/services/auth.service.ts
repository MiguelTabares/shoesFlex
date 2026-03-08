import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/usuario.repository';
import { RolUsuario, Usuario as IUsuario } from '../models/types';

export class AuthService {
    private usuarioRepository: UsuarioRepository;

    constructor() {
        this.usuarioRepository = new UsuarioRepository();
    }

    async register(data: Partial<IUsuario>): Promise<{ token: string, user: Partial<IUsuario> }> {
        const existingUser = await this.usuarioRepository.findByEmail(data.email!);
        if (existingUser) {
            throw new Error('El correo ya está registrado');
        }

        const RolModel = require('../models/rol.model').Rol;
        let rolToAssign = await RolModel.findOne({ where: { nombre: (data as any).rol || 'USER' } });

        if (!rolToAssign) {
            rolToAssign = await RolModel.findOne({ where: { nombre: 'USER' } });
        }

        if (!rolToAssign) {
            throw new Error('Roles no inicializados en base de datos');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password_hash!, salt);

        const newUser = await this.usuarioRepository.create({
            ...data,
            password_hash: hashedPassword,
            rol_id: rolToAssign.id as string,
        });

        // Refetch to include rol relation
        const userCreated = await this.usuarioRepository.findByEmail(newUser.email);
        if (!userCreated) throw new Error('Usuario no se creó correctamente');

        const rolResolved = ((userCreated as any).rol && (userCreated as any).rol.nombre) ? (userCreated as any).rol.nombre : 'USER';
        const token = this.generateToken(userCreated.id, rolResolved);
        const { password_hash, ...userWithoutPassword } = userCreated.toJSON();

        return { token, user: userWithoutPassword };
    }

    async login(email: string, password_hash: string): Promise<{ token: string, user: Partial<IUsuario> }> {
        const user = await this.usuarioRepository.findByEmail(email);
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const validPassword = await bcrypt.compare(password_hash, user.password_hash);
        if (!validPassword) {
            throw new Error('Credenciales inválidas');
        }

        const rolResolved = ((user as any).rol && (user as any).rol.nombre) ? (user as any).rol.nombre : 'USER';
        const token = this.generateToken(user.id, rolResolved);
        const { password_hash: pass, ...userWithoutPassword } = user.toJSON();

        return { token, user: userWithoutPassword };
    }

    private generateToken(id: string, rol: string): string {
        return jwt.sign(
            { id, rol },
            process.env.JWT_SECRET || 'supersecret_zapatoflex_key',
            { expiresIn: '1d' }
        );
    }
}
