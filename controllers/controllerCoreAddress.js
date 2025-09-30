/*  getAllAddresses,
    getAddressById,
    getAddressProfile,
    createCoreAddress,
    enterCoreAddress,
    updateCoreAddress,
    changePassword,
    deleteCoreAddress */

import coreAddress from '../models/coreAddress.js';
import bcypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

/* •   GET /api/direcciones-nucleo - Listar todas */
export const getALLAddresses = async (req, res) => {
    try {
        const address = await coreAddress.find().select('-password');
        res.status(200).json({
            succes: true,
            msg: 'listado',
            data:address
        }); 
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener direcciones de núcleo.' });
    }
};

/*• GET /api/direcciones-nucleo/:name - Obtener por nombre*/
export const getAddressById = async (req, res) => {
    try {
        const name = req.params.id; 
        
        const address = await coreAddressHelper.findAddressByName(name); // HELPER
        
        if (!address) {
            return res.status(404).json({ msg: 'Dirección del nucleo no encontrada.' });
        }
        res.status(200).json({
            succes: true,
            msg: 'Dirección de núcleo encontrada exitosamente', 
            data: address
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener la dirección de núcleo.' });
    }
};

/* • GET /api/direcciones-nucleo/me – Obtener perfil de la dirección-nucleo*/

export const getAddressProfile = async (req, res) => {
    try {
        const address = await coreAddressHelper.getAddressProfileData(req.user.id); //  HELPER
        
        if (!address) { 
            return res.status(404).json({ msg: 'Perfil de Dirección de Núcleo no encontrado.' });
        }
        
        res.status(200).json({
            succes: true,
            msg: 'direccion nucleo ',
            data: address
        });
    } catch (err) {
        res.status(500).json({ 
            error: 'Error al obtener el perfil de la dirección de núcleo.'
        });
    }
};
/* •   POST /api/direcciones-nucleo – Crear */
export const createCoreAddress = async (req, res) => {
    try {
        const addressData = req.body;
        
        const userResponse = await coreAddressHelper.createNewCoreAddress(addressData); //  HELPER

        res.status(201).json({
            success: true,
            message: 'coreadrres creado exitosamente',
            data: userResponse
        });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'El código ya está registrado'
            });
        }
        res.status(400).json({
            error: err.message || 'Error al crear la dirección de núcleo'
        });
    }
};


/* •   POST /api/direcciones-nucleo/login - Login */
export const enterCoreAddress = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const usuario = await coreAddressHelper.verificarCredenciales(email, password); // HELPER
        const token = await generarJWT(usuario.email);

        res.json({
            usuario: {
                nombre: usuario.name,
                email: usuario.email,
                codigo:usuario.code
            },
            token
        });
    } catch (error) {
        console.error('Error en login:', error);
        
        const statusCode = error.message.includes('Credenciales') ? 400 : 500;
        const mensajeError = statusCode === 400
            ? 'Credenciales inválidas'
            : 'Error en el servidor';

        res.status(statusCode).json({
            success: false,
            msg: mensajeError
        });
    }
};

/* •   PUT /api/direcciones-nucleo/:id – Actualizar*/

export const updateCoreAddress = async (req, res) => {
    try {
        const {nombre} = req.params 
        const updateFields = req.body;
        
        delete updateFields.code; 
        delete updateFields.password;
        
        const userResponse = await coreAddressHelper.updateAddressByName(nombre, updateFields); // HELPER

        if (!userResponse) {
            return res.status(404).json({
                success: false,
                msg: "no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            msg: "Dirección de núcleo actualizada exitosamente",
            DataTransfer: userResponse
        });

    } catch (error) {
        console.error('Error en actualizar:', error);
        res.status(500).json({
            success: false,
            message: 'Error actualizar'
        });
    }
};

/* •   PUT /api/direcciones-nucleo/:id/cambiar-password -Actualizar password*/

export const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const addressId = req.params.id // El parámetro es id

        const userResponse = await coreAddressHelper.updatePassword(addressId, oldPassword, newPassword); // <-- USO DEL HELPER
        
        res.status(200).json({
            success: true,
            msg: "Contraseña actualizada exitosamente",
            DataTransfer: userResponse
        });
    } catch (error) {
        console.error('Error en actualizarcontraseña', error);
        
        const statusCode = error.statusCode || 500; 

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Error al actualizar la contraseña'
        });
    }
};

/*• DELETE /api/direcciones-nucleo/:id - Eliminar */

export const deleteCoreAddress = async (req, res) => {
    try {
        const address = await coreAddressHelper.deleteAddressById(req.params.id); // HELPER

        if (!address) {
            return res.status(404).json({ msg: 'Dirección del nucleo no encontrada.' });
        }

        res.status(200).json({ msg: 'Dirección de núcleo eliminada exitosamente.' });

    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la dirección de núcleo.' });
    }
};