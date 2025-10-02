/* Acudientes: (rector, coordinador)Estos dos roles solo podrán listar (secretaria)Este rol es el único que podrá hacer todas las peticiones
•	GET /api/acudientes - Listar todos los acudientes 
•	GET /api/acudientes/buscar - Buscar por documento/nombre
•	GET /api/acudientes/:id - Obtener acudientes por ID
•	POST /api/acudientes -  crear acudientes 
•	PUT /api/acudientes/:id -  actualizar acudientes por ID 
•	PUT /api/acudientes/:id/activar -  activar acudiente
•	PUT /api/acudientes/:id/desactivar -  desactivar acudiente
•	DELETE /api/acudientes/:id - eliminar acudiente */


/* 
para el inge

getAllAttendant
searchAttendant
getAttendantById
createAttendant
updateAttendant
activateAttendant
desactivateAttendant
deleteAttendant
 */


import Attendant from '../models/attendant.js';
import bcrypt from 'bcryptjs';
/* import jwt from 'jsonwebtoken'; */


/* GET /api/acudientes - Listar todos los acudientes */
export const getAllAttendant = async (req, res) => {
  try {
    const attendants = await Attendant.find().select('-password');
    res.status(200).json(attendants);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener acudientes.' });
  }
};

/* GET /api/acudientes/buscar?query= - Buscar por documento o nombre */
export const searchAttendant = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ msg: 'Debe proporcionar un término de búsqueda.' });
    }

    const regex = new RegExp(query, 'i');
    const results = await Attendant.find({
      $or: [
        { nombres: regex },
        { apellidos: regex },
        { documento: regex }
      ]
    }).select('-password');

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar acudientes.' });
  }
};

/* GET /api/acudientes/:id - Obtener acudiente por ID */
export const getAttendantById = async (req, res) => {
  try {
    const attendant = await Attendant.findById(req.params.id).select('-password');
    if (!attendant) {
      return res.status(404).json({ msg: 'Acudiente no encontrado.' });
    }

    res.status(200).json(attendant);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el acudiente.' });
  }
};

/* POST /api/acudientes – Crear acudiente */
export const createAttendant = async (req, res) => {
  try {
    const { password, ...data } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAttendant = await Attendant.create({ ...data, password: hashedPassword });

    res.status(201).json(newAttendant);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Error al crear el acudiente.' });
  }
};

/* PUT /api/acudientes/:id – Actualizar acudiente */
export const updateAttendant = async (req, res) => {
  try {
    const attendant = await Attendant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');

    if (!attendant) {
      return res.status(404).json({ msg: 'Acudiente no encontrado.' });
    }

    res.status(200).json(attendant);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Error al actualizar acudiente.' });
  }
};

/* PUT /api/acudientes/:id/activar – Activar acudiente */
export const activateAttendant = async (req, res) => {
  try {
    const attendant = await Attendant.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!attendant) {
      return res.status(404).json({ msg: 'Acudiente no encontrado.' });
    }

    res.status(200).json({ msg: 'Acudiente activado exitosamente.', attendant });
  } catch (err) {
    res.status(500).json({ error: 'Error al activar acudiente.' });
  }
};

/* PUT /api/acudientes/:id/desactivar – Desactivar acudiente */
export const desactivateAttendant = async (req, res) => {
  try {
    const attendant = await Attendant.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!attendant) {
      return res.status(404).json({ msg: 'Acudiente no encontrado.' });
    }

    res.status(200).json({ msg: 'Acudiente desactivado exitosamente.', attendant });
  } catch (err) {
    res.status(500).json({ error: 'Error al desactivar acudiente.' });
  }
};

/* DELETE /api/acudientes/:id – Eliminar acudiente */
export const deleteAttendant = async (req, res) => {
  try {
    const attendant = await Attendant.findByIdAndDelete(req.params.id);

    if (!attendant) {
      return res.status(404).json({ msg: 'Acudiente no encontrado.' });
    }

    res.status(200).json({ msg: 'Acudiente eliminado exitosamente.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar acudiente.' });
  }
};
