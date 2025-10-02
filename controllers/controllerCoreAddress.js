/*  getAllAddresses,
    getAddressById,
    getAddressProfile,
    createCoreAddress,
    enterCoreAddress,
    updateCoreAddress,
    changePassword,
    deleteCoreAddress */


import coreAddress from '../models/coreAddress.js';
import bcrypt from 'bcryptjs';
import * as coreAddressHelper from "../helpers/coreAddress.js";
import direccionNucleo from '../models/coreAddress.js';
import { generarJWT } from '../middlewares/generar-jwt.js';

/* •   GET /api/direcciones-nucleo - Listar todas */
export const getALLAddresses = async (req, res) => {
    try {
        const address = await coreAddress.find().select('-password');
        res.status(200).json({
            succes: true,
            msg: 'listado',
            data: address
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener direcciones de núcleo.' });
    }
};

/*• GET /api / direcciones - nucleo /: id - Obtener por ID /*/
export const getAddressById = async (req, res) => {
    try {
        const { id } = req.params;  // ahora sí recibimos el id

        // buscar directamente por _id
        const address = await coreAddress.findById(id);

        if (!address) {
            return res.status(404).json({ msg: 'Dirección del núcleo no encontrada.' });
        }

        res.status(200).json({
            succes: true,
            msg: 'Dirección de núcleo encontrada exitosamente',
            data: address
        });

    } catch (err) {
        console.error("Error en getAddressById:", err);
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
/* •   POST /api/direcciones-nucleo – Crear */
export const createCoreAddress = async (req, res) => {
    try {
        const { name, code, email, password, ...rest } = req.body;

        // Generar hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar en el campo "password" (no "password_hash")
        const newDireccion = new direccionNucleo({
            name,
            code,
            email,
            password: hashedPassword,
            ...rest
        });

        await newDireccion.save();

        res.status(201).json({
            ok: true,
            msg: 'Núcleo creado exitosamente',
            data: {
                id: newDireccion._id,
                name: newDireccion.name,
                email: newDireccion.email
            }
        });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                ok: false,
                msg: `Ya existe un registro con el mismo valor en: ${Object.keys(err.keyPattern).join(', ')}`
            });
        }
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el núcleo',
            error: err.message
        });
    }
};




/* •   POST /api/direcciones-nucleo/login - Login */
export const enterCoreAddress = async (req, res) => {
    try {
        console.log('entro ---------------------------')
        const { email, password } = req.body;

        const user = await direccionNucleo.findOne({ email },"+password");

        if (!user) {
            return res.status(404).json({ msg: "Dirección del nucleo no encontrada." });
        }

        // Comparar contraseñas
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ msg: "Contraseña incorrecta." });
        }
        const token =await generarJWT(user.email);
        res.json({
            msg: "Login exitoso",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }, token
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ msg: "Error en el servidor", error });
    }
};


/* •   PUT /api/direcciones-nucleo/:id – Actualizar*/
export const updateCoreAddress = async (req, res) => {
    try {
        const { nombre } = req.params
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

/* •   PUT /api/direcciones-nucleo/:id/cambiar-password -Actualizar password*/
export const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldPassword, newPassword } = req.body;

        console.log("Body recibido en changePassword:", req.body);

        // Usamos el helper
        const updated = await coreAddressHelper.updatePassword(id, oldPassword, newPassword);

        res.json({
            ok: true,
            msg: "Contraseña actualizada correctamente",
            data: updated
        });
    } catch (err) {
        console.error("Error en changePassword:", err);
        res.status(err.statusCode || 500).json({
            ok: false,
            msg: err.message
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