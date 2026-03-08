import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

// Configuración de Sequelize para PostgreSQL (Vercel Postgres)
// Se importa pg explícitamente para evitar el error en entornos serverless
const sequelize = new Sequelize(process.env.POSTGRES_URL as string, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false,
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
