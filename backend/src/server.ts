import app from './app';
import { deaultDbContext } from './config/database';

// Intenta conectar a la base de datos
deaultDbContext().catch(e => console.error("DB connection error: ", e));

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Vercel requiere que se exporte la aplicación
export default app;
