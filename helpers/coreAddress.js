// helpers/coreAddress.helper.js
import coreAddress from '../models/coreAddress.js';
import bcrypt from 'bcryptjs';

// ------------------- FORMATEAR RESPUESTA -------------------
const formatCoreAddressResponse = (address) => {
    const addressObj = address.toObject ? address.toObject() : address;
    return {
        id: addressObj._id,
        name: addressObj.name,
        codigo: addressObj.code,
        dirrecion: addressObj.address,
        telefno: addressObj.phone,
        email: addressObj.email,
        responsable: addressObj.responsable,
    };
};

// ------------------- BUSCAR POR NOMBRE -------------------
export const findAddressByName = async (name) => {
    const address = await coreAddress.findOne({ name: String(name) }, '-password');
    return address;
};

// ------------------- PERFIL DE USUARIO -------------------
export const getAddressProfileData = async (userId) => {
    const address = await coreAddress.findById(userId, '-password');
    return address;
};

// ------------------- CREAR NUEVO NÚCLEO -------------------
export const createNewCoreAddress = async (addressData) => {
    const { password, ...rest } = addressData;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newCoreAddress = new coreAddress({
        ...rest,
        password: hash,
    });

    const saved = await newCoreAddress.save();

    return formatCoreAddressResponse(saved);
};

// ------------------- LOGIN / VERIFICAR CREDENCIALES -------------------
export const verificarCredenciales = async (email, password) => {
    const usuario = await coreAddress.findOne({ email }).select("+password");

    if (!usuario) {
        throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) {
        throw new Error('Credenciales inválidas');
    }

    const { password: _, ...userData } = usuario.toObject();
    return userData;
};

// ------------------- ACTUALIZAR DATOS -------------------
export const updateAddressById = async (userId, updateFields) => {
    const addressFound = await coreAddress.findById(userId);

    if (!addressFound) {
        return null;
    }

    addressFound.name = updateFields.name || addressFound.name;
    addressFound.address = updateFields.address || addressFound.address;
    addressFound.phone = updateFields.phone || addressFound.phone;
    addressFound.email = updateFields.email || addressFound.email;
    addressFound.responsable = updateFields.responsable || addressFound.responsable;

    const updatedCoreAddress = await addressFound.save();

    return formatCoreAddressResponse(updatedCoreAddress);
};

// ------------------- ACTUALIZAR CONTRASEÑA -------------------
export const updatePassword = async (addressId, oldPassword, newPassword) => {
    if (!oldPassword || !newPassword) {
        throw new Error("Debes enviar oldPassword y newPassword en el body.");
    }

    // Buscar usuario incluyendo el password
    const addressFound = await coreAddress.findById(addressId).select("+password");

    if (!addressFound) {
        throw new Error("Dirección de núcleo no encontrada.");
    }

    console.log("Password en DB:", addressFound.password);
    console.log("OldPassword recibido:", oldPassword);

    if (!addressFound.password) {
        throw new Error("No se encontró la contraseña almacenada en la base de datos.");
    }

    const isMatch = await bcrypt.compare(oldPassword, addressFound.password);
    if (!isMatch) {
        const error = new Error("Contraseña antigua incorrecta.");
        error.statusCode = 401;
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    addressFound.password = await bcrypt.hash(newPassword, salt);

    const updatedAddress = await addressFound.save();

    return {
        id: updatedAddress._id,
        name: updatedAddress.name,
        email: updatedAddress.email
    };
};

// ------------------- ELIMINAR -------------------
export const deleteAddressById = async (addressId) => {
    const address = await coreAddress.findByIdAndDelete(addressId);
    return address;
};


/* 
    export const verificarCredenciales= async (email, password) => {
        const usuario = await coreAddress.findOne({ email });
        if (!usuario) throw new Error('Credenciales inválidas');

        // CAMBIA 'usuario.password' por 'usuario.password_hash'
        const validaPassword = await bcrypt.compare(password, usuario.password_hash);

        if (!validaPassword) throw new Error('Credenciales inválidas');

        return usuario;
    }

export default helpercoreAddres;  */