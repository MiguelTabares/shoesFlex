import { Usuario } from './src/models/usuario.model';
import { deaultDbContext } from './src/config/database';

async function test() {
    await deaultDbContext();
    const user = await Usuario.findOne({ where: { email: 'miguelangeltabarescuadros@gmail.com' } });
    console.log("direct prop:", user?.password_hash);
    console.log("dataValues prop:", user?.dataValues.password_hash);
    process.exit(0);
}
test();
