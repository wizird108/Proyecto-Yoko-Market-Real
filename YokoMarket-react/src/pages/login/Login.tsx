/* =========================================================
   Login.tsx — INICIAR SESIÓN (ruta "/login")
   Reemplaza a login.html + login.js del original.
   Igual que el ejemplo de S10: estados para cada campo,
   login() del contexto y navigate() al terminar.
   ========================================================= */

import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'

import CuentaHero from '../../components/CuentaHero'
import useTitulo from '../../hooks/useTitulo'
import { useAuth } from '../../layout/Auth/Auth'

function Login() {
  useTitulo('Iniciar sesión | YokoMarket')

  const { login } = useAuth()
  const navigate = useNavigate()

  /* Inputs "controlados" (S9): el valor vive en el estado. */
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')

  function enviar(evento: FormEvent) {
    evento.preventDefault() // evita que el formulario recargue la página

    if (login(correo, contrasena)) {
      navigate('/perfil')
    } else {
      setError('Correo o contraseña incorrectos. Regístrate primero si no tienes una cuenta de prueba.')
    }
  }

  return (
    <section className="cuenta-layout">
      <CuentaHero />

      <form className="form-cuenta" id="form-login" onSubmit={enviar}>
        <h1>HOLA DE NUEVO</h1>
        <p>Entra y sigue coleccionando.</p>

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
            autoComplete="current-password"
            id="contrasena"
            name="contrasena"
            required
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>

        <button className="boton-principal" type="submit">
          INICIAR SESIÓN
        </button>
        <Link to="/registro">¿No tienes cuenta? Regístrate</Link>

        <p id="error-formulario" role="status">
          {error}
        </p>
        <p className="nota-local">Cuenta de prueba local: usa datos de ejemplo.</p>
      </form>
    </section>
  )
}

export default Login
