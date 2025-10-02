import { response } from 'express';
import mongoose, { model } from 'mongoose';

const direccionNucleoSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true, 'El nombre es requerido.'],
        trim: true,
        unique: true
    },
    code: {
        type: String,
        require: [true, 'El codigo es requerido.'],
        trim: true,
        unique: true
    },
    address: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Por favor, ingrese un correo válido'],
    },
    password: {  
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false
    },
    responsable: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
})

direccionNucleoSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const direccionNucleo = model('direccionNucleo', direccionNucleoSchema);

export default direccionNucleo;