import coreAddress from '../models/coreAddress.js';
import bcypt from 'bcryptjs';

/* •   GET /api/direcciones-nucleo - Listar todas */
export const getALLAddresses = async (req, res) => {
    try {
        const address = await coreAddress.find().select('-password');
        res.status(200).json(address);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener direcciones de núcleo.' });
    }
};

/*• GET /api/direcciones-nucleo/:id - Obtener por nombre*/
export const getAddressById = async (req, res) => {
    try {
        const {name}=req.params.id
        const address = await coreAddress.find({name:String(name)},'-password');
        if (!address) {
            return res.status(404).json({ message: 'Dirección del nucleo no encontrada.' });
        }
        res.status(200).json({
            succes: true,
            msg:'No encontrado',
            data:address
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener la dirección de núcleo.' });
    }
};

/* • GET /api/direcciones-nucleo/me – Obtener perfil de la dirección-nucleo*/

/* -----------<--FALTA POR HACER-->----------- */

/* •   POST /api/direcciones-nucleo – Crear */
export const createCoreAddress = async (req, res) => {
    try {
        const { password, ...data } = req.body;
        const hashedPassword = await bcypt.hash(password, 10);
        const newAddress = await coreAddress.create({ ...data, password: hashedPassword });
        res.status(201).json(newAddress);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

/* --------------------faltantes--------------------------*/

/* •   POST /api/direcciones-nucleo/login - Login */

/* •   PUT /api/direcciones-nucleo/:id – Actualizar*/

/* •   PUT /api/direcciones-nucleo/:id/cambiar-password -Actualizar password*/

/*• DELETE /api/direcciones-nucleo/:id - Eliminar */