// router.js
import { Router } from "express";
import {
    getALLAddresses,
    getAddressById,
/*     getAddressProfile,
 */    createCoreAddress,
    enterCoreAddress,
    updateCoreAddress,
    changePassword,
    deleteCoreAddress
} from '../controllers/controllerCoreAddress.js'
import { check } from "express-validator";

// No necesitamos importar el helper aquí, solo los controladores.
// import helpercoreAddres from "../helpers/coreAddress.js"; 
import { validarCampos } from "../middlewares/validar-campos.js"; // Middleware para manejar errores de validación
import { validarJWT } from "../middlewares/validar-jwt.js";
const router = Router();

// GET /api/core-address/listado (Obtener todo)
router.get('/core-address/listado',
    validarJWT,
    getALLAddresses
)

// GET /api/core-address/id/:id (Obtener por ID)
router.get('/core-address/:id',
    [
        check('id', 'El ID es obligatorio').isMongoId(),
        validarCampos
    ],
    getAddressById
);

/* // GET /api/core-address/me (Obtener perfil)
router.get('/core-address/me', 
    getAddressProfile 
); */

// POST /api/core-address (Crear)
router.post('/core-address', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('code', 'El código es obligatorio').not().isEmpty(),
        check('address', 'La dirección es obligatoria').not().isEmpty(),
        check('phone', 'El teléfono es obligatorio').isMobilePhone(), 
        check('email', 'El email no es válido').isEmail(),
        check('password', 'La contraseña debe tener más de 6 caracteres').isLength({ min: 6 }),
        check('responsable', 'El responsable es obligatorio').not().isEmpty(),
        validarCampos
    ],
    createCoreAddress
);

// POST /api/core-address/login (Login)
router.post('/core-address/login', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    enterCoreAddress
);

// PUT /api/core-address/:id (Actualizar)
router.put('/core-address/:id', 
    [
        check('id', 'El ID del usuario es obligatorio').not().isEmpty(),
        check('email').optional().isEmail(),
        check('phone').optional().isMobilePhone(),
        validarCampos
    ],
    updateCoreAddress
);

// PUT /api/core-address/:id/change-password (Cambiar contraseña)
router.put('/core-address/:id/change-password', 
    [
        check('id', 'El ID del usuario es obligatorio').isMongoId(),
        check('oldPassword', 'La contraseña antigua es obligatoria').not().isEmpty(),
        check('newPassword', 'La nueva contraseña debe tener más de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    changePassword
);

// DELETE /api/core-address/:id (Eliminar)
router.delete('/core-address/:id', 
    [
        check('id', 'El ID es obligatorio').isMongoId(),
        validarCampos
    ],
    deleteCoreAddress
);

export default router;