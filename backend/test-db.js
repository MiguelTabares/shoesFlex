const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
    logging: false
});

async function run() {
    const [results, metadata] = await sequelize.query("SELECT * FROM usuarios WHERE email = 'miguelangeltabarescuadros@gmail.com'");
    console.log(results);
}
run();
