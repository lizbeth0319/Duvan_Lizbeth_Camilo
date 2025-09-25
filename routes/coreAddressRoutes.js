import { Router } from "express";
import {
    getAllAddresses,
    getAddressById,
    getAddressProfile,
    createCoreAddress,
    enterCoreAddress,
    updateCoreAddress,
    changePassword,
    deleteCoreAddress
} from '../controllers/controllerCoreAddress.js'

const router = Router();

router.get('/core-address', getAllAddresses);

router.get('/core-address/:id', getAddressById);

router.get('/core-address/me', getAddressProfile)

router.post('/core-address', createCoreAddress)

router.post('/core-address/login', enterCoreAddress)

router.put('/core-address/:id', updateCoreAddress)

router.put('/core-address/:id/change-password', changePassword)

router.delete('/core-address/:id', deleteCoreAddress)

export default router;