import { sequelize, deaultDbContext } from '../config/database';
// Importing these so relations are loaded
import '../models/rol.model';
import '../models/usuario.model';
import '../models/producto.model';
import '../models/inventario.model';
import '../models/carrito.model';
import '../models/carrito-item.model';
import '../models/pedido.model';
import '../models/item-pedido.model';

async function syncModels() {
    try {
        await deaultDbContext();
        console.log('--- Syncing Models ---');

        await sequelize.sync({ alter: true }); // Updates existing tables without dropping them

        console.log('✅ Base de datos sincronizada correctamente.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during model sync:', error);
        process.exit(1);
    }
}

syncModels();
