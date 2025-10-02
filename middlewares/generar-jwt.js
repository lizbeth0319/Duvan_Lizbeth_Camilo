import jwt from 'jsonwebtoken';

export const generarJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // 👈 cambia esto por tu clave real en .env
      { expiresIn: '12h' }, // duración del token
      (err, token) => {
        if (err) {
          console.error(err);
          reject('No se pudo generar el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};
