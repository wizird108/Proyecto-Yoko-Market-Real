// Entrega final: conserva la interfaz previa y conecta los datos del sistema.

import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import CuentaHero from "../../components/CuentaHero";
import useTitulo from "../../hooks/useTitulo";
import { useAuth } from "../../layout/Auth/Auth";

function Login() {
  useTitulo("Sign in | YokoMarket");

  const { login } = useAuth();
  const navigate = useNavigate();
  const [parametros] = useSearchParams();

  /* Inputs "controlados" (S9): el valor vive en el estado. */
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent) {
    evento.preventDefault(); // evita que el formulario recargue la página

    setEnviando(true);
    const problema = await login(correo, contrasena);
    setEnviando(false);
    if (problema) setError(problema);
    else navigate("/perfil");
  }

  return (
    <section className="cuenta-layout">
      <CuentaHero />

      <form className="form-cuenta" id="form-login" onSubmit={enviar}>
        <h1>WELCOME BACK</h1>
        {parametros.has("registered") && (
          <p role="status">
            Account created. Check your inbox to confirm your email, then sign
            in.
          </p>
        )}
        <p>Sign in and keep collecting.</p>

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
            autoComplete="current-password"
            id="contrasena"
            name="contrasena"
            required
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>

        <button className="boton-principal" type="submit" disabled={enviando}>
          SIGN IN
        </button>
        <Link to="/registro">New here? Create an account</Link>

        <p id="error-formulario" role="status">
          {error}
        </p>
        <p className="nota-local">Use your registered email and password.</p>
      </form>
    </section>
  );
}

export default Login;
