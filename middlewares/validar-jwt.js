import jwt from "jsonwebtoken";
import "dotenv/config";
import direccionNucleo from '../models/coreAddress.js'

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la petición."
        });
    }
    try {
        console.log('entro a función validarJWT')
        const payload = jwt.verify(token, process.env.JWT_KEY); 
        const { email } = payload;

        let usuario = await direccionNucleo.find({ email });
        console.log('email',email)

        if (!usuario) {
            return res.status(401).json({
                msg: "Token no válido - usuario no existe en DB."
            });
        }
        console.log(usuario)

        if (usuario.estado === 0 || usuario.estado === false) { 
            return res.status(401).json({
                msg: "Token no válido - el usuario está inactivo." 
            });
        }
        req.usuario = usuario;
        next();
        
    } catch (error) {
        console.error('Error en JWT:', error.message); 
        res.status(401).json({
            msg: "Token no válido o ha expirado."
        });
    }
};