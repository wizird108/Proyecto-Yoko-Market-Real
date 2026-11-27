// El proveedor Auth conserva la contraseña; aquí solo describimos el perfil público.
export interface Sesion {
  id: string;
  nombre: string;
  correo: string;
  bio?: string;
}
