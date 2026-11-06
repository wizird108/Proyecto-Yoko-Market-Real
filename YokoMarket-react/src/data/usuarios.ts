/* =========================================================
   usuarios.ts — CUENTAS DE USUARIO
   Igual que "usuarios" de datos.js del original: una cuenta de
   prueba (la pedía la rúbrica de la entrega anterior).
   Las cuentas nuevas que se crean en Registro se guardan en
   localStorage ("yoko-cuentas"). No es autenticación real:
   todo vive en este navegador.
   ========================================================= */

/* Cuenta completa (con contraseña): solo se usa para comparar en el login. */
export interface Cuenta {
  id: string
  nombre: string
  correo: string
  contrasena: string
}

/* Sesión: lo que guardamos del usuario que entró. Igual que el
   original, NO copiamos la contraseña. */
export interface Sesion {
  id: string
  nombre: string
  correo: string
}

/* Cuenta de prueba:  fan@yokomarket.com  /  123456 */
export const usuariosDemo: Cuenta[] = [
  {
    id: 'demo-yoko',
    nombre: 'yoko_fan_95',
    correo: 'fan@yokomarket.com',
    contrasena: '123456',
  },
]
