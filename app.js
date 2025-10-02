import express from 'express';
import coreAddressRoutes from './routes/coreAddressRoutes.js';
import { connectDB } from './services/db.js'

const app = express();

app.use(express.json());

app.use('/api', coreAddressRoutes);

const PORT = process.env.PORT; 

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  connectDB().then(() => {
    }).catch(error => {
        console.error("Failed to start server due to DB connection error:", error);
    });
});