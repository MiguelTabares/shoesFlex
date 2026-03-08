import { sequelize, deaultDbContext } from '../config/database';
import { Rol } from '../models/rol.model';
import { Usuario } from '../models/usuario.model';
// Importing these so relations are loaded
import '../models/carrito.model';
import '../models/carrito-item.model';
import '../models/producto.model';
import '../models/inventario.model';
import bcrypt from 'bcryptjs';

async function initRoles() {
    try {
        await deaultDbContext();
        console.log('--- Force Syncing Database para reconstruir Usuarios y Roles ---');

        // This will drop tables and recreate them with the new associations
        await sequelize.query('DROP TABLE IF EXISTS "carritos" CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS "carrito_items" CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS "usuarios" CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS "roles" CASCADE');

        await sequelize.sync({ force: false });

        console.log('--- Registrando roles "ADMIN" y "USER" ---');
        const adminRol = await Rol.create({ nombre: 'ADMIN' });
        const userRol = await Rol.create({ nombre: 'USER' });

        console.log('✅ Roles creados con éxito');

        // Optional: create a default admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Usuario.create({
            nombre: 'Super Administrador',
            email: 'admin@zapatoflex.com',
            password_hash: hashedPassword,
            rol_id: adminRol.getDataValue('id')
        } as any);
        console.log('✅ Usuario Administrador Creado: admin@zapatoflex.com | admin123');

        console.log('DONE!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during role init:', error);
        process.exit(1);
    }
}

initRoles();
