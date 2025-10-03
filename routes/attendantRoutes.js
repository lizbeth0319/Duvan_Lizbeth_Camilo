// •	GET /api/acudientes - Listar todos los acudientes 
// •	GET /api/acudientes/buscar - Buscar por documento/nombre
// •	GET /api/acudientes/:id - Obtener acudientes por ID
// •	POST /api/acudientes -  crear acudientes 
// •	PUT /api/acudientes/:id -  actualizar acudientes por ID 
// •	PUT /api/acudientes/:id/activar -  activar acudiente
// •	PUT /api/acudientes/:id/desactivar -  desactivar acudiente
// •	DELETE /api/acudientes/:id - eliminar acudiente 

// router.js
import { Router } from "express";
import {
    getAllAttendant,
    searchAttendant,
    getAttendantById,
    createAttendant,
    updateAttendan,
    activateAttendant,
    desactivateAttendant,
    deleteAttendant
} from '../controllers/controllerAttendant.js'
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js"; // Middleware para manejar errores de validación
import { validarJWT } from "../middlewares/validar-jwt.js";
const router = Router();

// GET /api/attendant (Listar todos los acudientes)
router.get('/attendant',
    validarJWT,
    getAllAttendant
)

// GET /api/attendant/search (Buscar por documento/nombre)
router.get('/attendant/search',
    [
        
        validarCampos
    ],
    searchAttendant
);

// GET /api/attendant/:id (Obtener acudientes por ID)
router.get('/attendant/:id',
    getAttendantById
);

// POST /api/attendant (Crear acudientes)
router.post('/attendant',
    [
        
        validarCampos
    ],
    createAttendant
);

// PUT /api//attendant/:id' (Actualizar acudientes por ID)
router.put('/core-address/:id',
    [
        
        validarCampos
    ],
    updateAttendan
);

// PUT /api/attendance/:id/activate  (Activar acudiente)
router.put('/attendance/:id/activate',
    [
        
        validarCampos
    ],
    activateAttendant
);

// PUT /api/attendance/:id/activate  (Desactivar acudiente)
router.put('/attendance/:id/activate',
    [
        
        validarCampos
    ],
    desactivateAttendant
);

// DELETE /api/attendant/:id (Eliminar acudiente)
router.delete('/attendant/:id',
    [
        check('id', 'El ID es obligatorio').isMongoId(),
        validarCampos
    ],
    deleteAttendant
);

export default router;