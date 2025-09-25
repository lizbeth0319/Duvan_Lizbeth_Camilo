import express from 'express';
import coreAddressRoutes from './routes/coreAddressRoutes.js';

const app = express();

app.use(express.json());

app.use('/api/', coreAddressRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});