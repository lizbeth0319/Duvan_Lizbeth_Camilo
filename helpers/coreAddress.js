// helpers/coreAddress.helper.js
import coreAddress from '../models/coreAddress.js';
import bcrypt from 'bcryptjs'; 
import { generarJWT } from './jwt.helper.js'; 

const formatCoreAddressResponse = (address) => {
    const addressObj = address.toObject ? address.toObject() : address;
    return {
        name: addressObj.name,
        codigo: addressObj.code,
        dirrecion: addressObj.address, 
        telefno: addressObj.phone,    
        email: addressObj.email,
        responsable: addressObj.responsable,
    };
};


export const findAddressByName = async (name) => {
    const address = await coreAddress.findOne({ name: String(name) }, '-password_hash');
    return address;
};

export const getAddressProfileData = async (userId) => {
    // Busca por ID de usuario (obtenido del token/middleware) y excluye el hash de la contraseña
    const address = await coreAddress.findById(userId, '-password_hash');
    return address;
};

export const createNewCoreAddress = async (addressData) => {
    const { password, ...rest } = addressData;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newCoreAddress = new coreAddress({
        ...rest,
        password_hash: hash,
    });

    const savege = await newCoreAddress.save();

    return formatCoreAddressResponse(savege);
};

export const verificarCredenciales = async (email, password) => {
    const usuario = await coreAddress.findOne({ email });

    if (!usuario) {
        throw new Error('Credenciales inválidas');
    }
    const isMatch = await bcrypt.compare(password, usuario.password_hash);

    if (!isMatch) {
        throw new Error('Credenciales inválidas');
    }

    const { password_hash, ...userData } = usuario.toObject();
    return userData;
};


export const updateAddressByName = async (nombre, updateFields) => {
    const addressFound = await coreAddress.findOne({ name: String(nombre) });

    if (!addressFound) {
        return null; //  el 404
    }

    addressFound.name = updateFields.name || addressFound.name;
    addressFound.address = updateFields.address || addressFound.address;
    addressFound.phone = updateFields.phone || addressFound.phone;
    addressFound.email = updateFields.email || addressFound.email;
    addressFound.responsable = updateFields.responsable || addressFound.responsable;

    const updatedCoreAddress = await addressFound.save();

    return formatCoreAddressResponse(updatedCoreAddress);
};

export const updatePassword = async (addressId, oldPassword, newPassword) => {
    const addressfound = await coreAddress.findById(addressId);

    if (!addressfound) {
        throw new Error('Dirección de núcleo no encontrada.');
    }
    
    const isMatch = await bcrypt.compare(oldPassword, addressfound.password_hash);
    if (!isMatch) {
        const error = new Error('Contraseña antigua incorrecta.');
        error.statusCode = 401; 
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    addressfound.password_hash = await bcrypt.hash(newPassword, salt);

    const updatedcoreadrees = await addressfound.save();

    return formatCoreAddressResponse(updatedcoreadrees);
};

export const deleteAddressById = async (addressId) => {
    const address = await coreAddress.findByIdAndDelete(addressId);
    return address;
};

/* 
    export const verificarCredenciales= async (email, password) => {
        const usuario = await coreAddress.findOne({ email });
        if (!usuario) throw new Error('Credenciales inválidas');

        // 💡 CAMBIA 'usuario.password' por 'usuario.password_hash'
        const validaPassword = await bcrypt.compare(password, usuario.password_hash);

        if (!validaPassword) throw new Error('Credenciales inválidas');

        return usuario;
    }

export default helpercoreAddres;  */