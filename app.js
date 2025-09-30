import express from 'express';
import coreAddressRoutes from './routes/coreAddressRoutes.js';
import { connectDB } from './db.js';
import dotenv from 'dotenv'

dotenv.config();

const app = express();

connectDB();

app.use(express.json());

app.use('/api/', coreAddressRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});