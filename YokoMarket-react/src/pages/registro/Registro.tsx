/* =========================================================
   Registro.tsx — CREAR CUENTA (ruta "/registro")
   Reemplaza a registro.html + registro.js del original.
   Mismas validaciones: nombre no vacío, contraseñas iguales
   y correo no repetido. Al terminar, va al login.
   ========================================================= */

import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'

import CuentaHero from '../../components/CuentaHero'
import useTitulo from '../../hooks/useTitulo'
import { useAuth } from '../../layout/Auth/Auth'

function Registro() {
  useTitulo('Crear cuenta | YokoMarket')

  const { register } = useAuth()
  const navigate = useNavigate()

  /* Un estado por campo (inputs controlados). */
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    setError('')

    // 1. Validaciones (las mismas del original).
    if (nombre.trim().length === 0) {
      setError('Escribe un nombre de usuario.')
      return
    }
    if (contrasena !== confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    // 2. register() devuelve '' si salió bien, o el texto del error.
    const problema = register(nombre, correo, contrasena)
    if (problema) {
      setError(problema)
      return
    }
    navigate('/login')
  }

  return (
    <section className="cuenta-layout">
      <CuentaHero />

      <form className="form-cuenta" id="form-registro" onSubmit={enviar}>
        <h1>CREA TU CUENTA</h1>
        <p>Únete a la comunidad YokoMarket.</p>

        <div className="campo">
          <label htmlFor="nombre">NOMBRE DE USUARIO</label>
          <input
            autoComplete="nickname"
            id="nombre"
            maxLength={40}
            name="nombre"
            required
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="correo">CORREO ELECTRÓNICO</label>
          <input
            autoComplete="username"
            id="correo"
            name="correo"
            required
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="contrasena">CONTRASEÑA</label>
          <input
            autoComplete="new-password"
            id="contrasena"
            minLength={6}
            name="contrasena"
            required
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="confirmar">CONFIRMAR CONTRASEÑA</label>
          <input
            autoComplete="new-password"
            id="confirmar"
            minLength={6}
            name="confirmar"
            required
            type="password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />
        </div>

        <button className="boton-principal" type="submit">
          CREAR CUENTA
        </button>
        <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>

        <p id="error-formulario" role="status">
          {error}
        </p>
        <p className="nota-local">Registro de prueba en este navegador. Usa una contraseña de ejemplo.</p>
      </form>
    </section>
  )
}

export default Registro
