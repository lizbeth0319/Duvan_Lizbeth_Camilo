/*  getAllAddresses,
    getAddressById,
    getAddressProfile,
    createCoreAddress,
    enterCoreAddress,
    updateCoreAddress,
    changePassword,
    deleteCoreAddress */

import coreAddress from '../models/coreAddress.js';
import bcypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

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
        const { name } = req.params.id
        const address = await coreAddress.find({ name: String(name) }, '-password');
        if (!address) {
            return res.status(404).json({ msg: 'Dirección del nucleo no encontrada.' });
        }
        res.status(200).json({
            succes: true,
            msg: 'No encontrado',
            data: address
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener la dirección de núcleo.' });
    }
};

/* • GET /api/direcciones-nucleo/me – Obtener perfil de la dirección-nucleo*/

export const getAddressProfile = async (req, res) => {
    try {
        const address = await coreAddress.findById(req.user.id).select('-password');
        res.status(200).json(address);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el perfil de la dirección de núcleo.' });
    }
};

/* •   POST /api/direcciones-nucleo – Crear */
export const createCoreAddress = async (req, res) => {
    try {
        const { password, ...data } = req.body;
        const hashedPassword = await bcypt.hash(password, 10);
        const newAddress = await coreAddress.create({ ...data, password: hashedPassword });
        res.status(201).json(newAddress);
    } catch (err) {
        res.status(400).json({ error: err.msg });
    }
};


/* •   POST /api/direcciones-nucleo/login - Login */
export const enterCoreAddress = async (req, res) => {
    try {
        const { email, password } = req.body;
        const address = await coreAddress.findOne({ email });

        if (!address) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const isMatch = await bcypt.compare(password, address.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const token = jwt.sign({ id: address._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });

    } catch (err) {
        res.status(500).json({ error: err.msg });
    }
};

/* •   PUT /api/direcciones-nucleo/:id – Actualizar*/

export const updateCoreAddress = async (req, res) => {
    try {
        const address = await coreAddress.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');

        if (!address) {
            return res.status(404).json({ msg: 'Dirección del nucleo no encontrada.' });
        }

        res.status(200).json(address);

    } catch (err) {
        res.status(400).json({ error: err.msg });
    }
};

/* •   PUT /api/direcciones-nucleo/:id/cambiar-password -Actualizar password*/

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const address = await coreAddress.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ msg: 'Dirección del nucleo no encontrada.' });
        }

        const isMatch = await bcypt.compare(oldPassword, address.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña antigua incorrecta.' });
        }

        const hashedPassword = await bcypt.hash(newPassword, 10);
        address.password = hashedPassword;
        await address.save();

        res.status(200).json({ msg: 'Contraseña actualizada exitosamente.' });

    } catch (err) {
        res.status(500).json({ error: err.msg });
    }
};

/*• DELETE /api/direcciones-nucleo/:id - Eliminar */

export const deleteCoreAddress = async (req, res) => {
    try {
        const address = await coreAddress.findByIdAndDelete(req.params.id);

        if (!address) {
            return res.status(404).json({ msg: 'Dirección del nucleo no encontrada.' });
        }

        res.status(200).json({ msg: 'Dirección de núcleo eliminada exitosamente.' });

    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la dirección de núcleo.' });
    }
};
