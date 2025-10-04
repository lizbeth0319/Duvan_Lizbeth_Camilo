 /* 11. Acudiente  (Rector, Coordinador y Secretaria)  
{
_id: Object
nombres: String,
apellidos: String,
telefono: String,
documento: String,
tipo de documento: String,
email: String,
password: String,
isActive: Boolean,
}, */
import mongoose, { model } from 'mongoose';

const mongoose = require('mongoose');
const AcudienteSchema = new mongoose.Schema({

    name: {
    type: String,
    required: true,
    trim: true
  },
  surnames: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  document: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  documenttype: {
    type: String,
    required: true,
    enum: ['CC', 'TI', 'CE', 'Otro'], 
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rol: {
    type: String,
    enum: ['Rector', 'Coordinador', 'Secretaria'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Acudiente', AcudienteSchema);
