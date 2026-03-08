import { AuthService } from './src/services/auth.service';
import { deaultDbContext } from './src/config/database';

async function test() {
    await deaultDbContext();
    const service = new AuthService();
    try {
        const res = await service.login('miguelangeltabarescuadros@gmail.com', 'Miguel123');
        console.log(res);
    } catch (e) {
        console.log("ERROR IS:", e);
    }
    process.exit(0);
}
test();
