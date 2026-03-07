import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'ZapatoFlex API is running' });
});

export default app;
