import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Validar email
export function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// Hashear contraseña
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

// Comparar contraseña
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generar token JWT
export function generateToken(payload, secret, expiresIn = '1h') {
  return jwt.sign(payload, secret, { expiresIn });
}

// Verificar token JWT
export function verifyToken(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

// Validar campos requeridos en un objeto
export function validateRequiredFields(obj, fields = []) {
  return fields.every(field => obj[field]);
}