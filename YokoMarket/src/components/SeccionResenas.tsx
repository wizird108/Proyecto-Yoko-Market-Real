// Entrega final: conserva la interfaz previa y conecta los datos del sistema.

import { useState, type FormEvent } from "react";
import { Link, useOutletContext } from "react-router";

import type { Producto, Resena } from "../data/productos";
import { textoEstrellas } from "../data/resenas";
import { publicarComentario } from "../services/datosRemotos";
import { useCatalogo } from "../store/store";
import { useAuth } from "../layout/Auth/Auth";
import type { ContextoMain } from "../layout/Main/Main";

interface SeccionResenasProps {
  producto: Producto;
}

function SeccionResenas({ producto }: SeccionResenasProps) {
  const { user } = useAuth(); // null si no hay sesión
  const { mostrarMensaje } = useOutletContext<ContextoMain>();

  /* Reseñas que escribieron los usuarios para ESTE producto. */
  const { comentarios } = useCatalogo();
  const resenasGuardadas = comentarios.filter(
    (resena) => resena.producto_id === String(producto.id),
  );
  const [enviando, setEnviando] = useState(false);

  /* Estado del formulario. */
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [estrellas, setEstrellas] = useState(5); // de 1 a 5
  const [texto, setTexto] = useState("");
  const [error, setError] = useState("");

  /* Todas las reseñas: las del producto + las de los usuarios. */
  const resenas = [...producto.resenas, ...resenasGuardadas];

  function cerrarFormulario() {
    setFormularioAbierto(false);
    setEstrellas(5);
    setTexto("");
    setError("");
  }

  async function publicar(evento: FormEvent) {
    evento.preventDefault();
    if (!user) return;

    if (texto.trim().length === 0) {
      setError("Write your review before publishing.");
      return;
    }

    const nueva: Resena = {
      autor: "@" + user.nombre, // el usuario de la sesión
      estrellas: textoEstrellas(estrellas), // 4 → "★★★★☆"
      texto: texto.trim(),
    };

    setEnviando(true);
    try {
      await publicarComentario(producto.id, nueva);
      cerrarFormulario();
      mostrarMensaje("Thanks! Your review was published.");
    } catch {
      setError("Unable to publish your review. Please retry.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="resenas">
      <h2>COMMENTS & REVIEWS</h2>

      {/* ---------- ESCRIBIR UNA RESEÑA ---------- */}
      {!user && (
        <p className="nota-resena">
          <Link to="/login">Sign in</Link> to write a review.
        </p>
      )}

      {user && !formularioAbierto && (
        <button
          className="boton-resena"
          type="button"
          onClick={() => setFormularioAbierto(true)}
        >
          WRITE A REVIEW
        </button>
      )}

      {user && formularioAbierto && (
        <form className="form-resena" onSubmit={publicar}>
          <p className="nota-resena">
            Writing as <strong>@{user.nombre}</strong>
          </p>

          {/* Estrellas: 5 botones. Las que están hasta la elegida se pintan. */}
          <fieldset className="estrellas-resena">
            <legend>RATING</legend>
            {[1, 2, 3, 4, 5].map((numero) => (
              <button
                key={numero}
                type="button"
                className={numero <= estrellas ? "activa" : undefined}
                aria-label={numero + (numero === 1 ? " star" : " stars")}
                aria-pressed={numero === estrellas}
                onClick={() => setEstrellas(numero)}
              >
                ★
              </button>
            ))}
          </fieldset>

          <label className="solo-lectores" htmlFor="texto-resena">
            Comment
          </label>
          <textarea
            id="texto-resena"
            maxLength={500}
            placeholder="Tell fellow fans what you think…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />

          <div className="acciones-resena">
            <button
              className="boton-publicar-resena"
              type="submit"
              disabled={enviando}
            >
              PUBLISH
            </button>
            <button
              className="boton-resena"
              type="button"
              onClick={cerrarFormulario}
            >
              CANCEL
            </button>
          </div>

          <p className="error-resena" role="status">
            {error}
          </p>
        </form>
      )}

      {/* ---------- LISTA DE RESEÑAS ---------- */}
      <div className="lista-resenas">
        {resenas.map((resena, indice) => (
          <article key={indice} className="tarjeta-resena">
            <h3>
              {resena.autor} · {resena.estrellas}
            </h3>
            <p>{resena.texto}</p>
          </article>
        ))}
        {resenas.length === 0 && <p>This product has no reviews yet.</p>}
      </div>
    </section>
  );
}

export default SeccionResenas;
