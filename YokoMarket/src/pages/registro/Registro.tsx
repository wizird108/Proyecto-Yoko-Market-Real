// Entrega final: conserva la interfaz previa y conecta los datos del sistema.

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import CuentaHero from "../../components/CuentaHero";
import useTitulo from "../../hooks/useTitulo";
import { useAuth } from "../../layout/Auth/Auth";

function Registro() {
  useTitulo("Create account | YokoMarket");

  const { register } = useAuth();
  const navigate = useNavigate();

  /* Un estado por campo (inputs controlados). */
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setError("");

    // 1. Validaciones (las mismas del original).
    if (nombre.trim().length === 0) {
      setError("Enter a display name.");
      return;
    }
    if (contrasena !== confirmar) {
      setError("Passwords do not match.");
      return;
    }

    // 2. register() devuelve '' si salió bien, o el texto del error.
    setEnviando(true);
    const problema = await register(nombre, correo, contrasena);
    setEnviando(false);
    if (problema) {
      setError(problema);
      return;
    }
    navigate("/login?registered=1");
  }

  return (
    <section className="cuenta-layout">
      <CuentaHero />

      <form className="form-cuenta" id="form-registro" onSubmit={enviar}>
        <h1>CREATE YOUR ACCOUNT</h1>
        <p>Join the YokoMarket community.</p>

        <div className="campo">
          <label htmlFor="nombre">DISPLAY NAME</label>
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
          <label htmlFor="correo">EMAIL</label>
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
          <label htmlFor="contrasena">PASSWORD</label>
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
          <label htmlFor="confirmar">CONFIRM PASSWORD</label>
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

        <button className="boton-principal" type="submit" disabled={enviando}>
          CREATE ACCOUNT
        </button>
        <Link to="/login">Already have an account? Sign in</Link>

        <p id="error-formulario" role="status">
          {error}
        </p>
        <p className="nota-local">
          Check your inbox to confirm your account before signing in.
        </p>
      </form>
    </section>
  );
}

export default Registro;
