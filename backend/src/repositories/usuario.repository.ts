import { Usuario } from '../models/usuario.model';
import { Usuario as IUsuario } from '../models/types';

export class UsuarioRepository {
    async findByEmail(email: string): Promise<Usuario | null> {
        return await Usuario.findOne({
            where: { email },
            include: ['rol']
        });
    }

    async create(usuario: Partial<IUsuario>): Promise<Usuario> {
        return await Usuario.create(usuario as any);
    }

    async findById(id: string): Promise<Usuario | null> {
        return await Usuario.findByPk(id);
    }
}
