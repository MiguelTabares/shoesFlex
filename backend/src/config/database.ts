import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de Sequelize para PostgreSQL (Vercel Postgres)
// Se utiliza SSL en producción/Vercel por requisito de la plataforma
const sequelize = new Sequelize(process.env.POSTGRES_URL as string, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false, // Puedes cambiarlo a console.log para ver las transacciones SQL
});

const deaultDbContext = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection to Vercel PostgreSQL has been established successfully via Sequelize.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
}

export { sequelize, deaultDbContext };
