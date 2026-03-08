import app from './app';
import { deaultDbContext } from './config/database';

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // Intenta conectar a la base de datos cuando arranca el servidor
    await deaultDbContext();
});
