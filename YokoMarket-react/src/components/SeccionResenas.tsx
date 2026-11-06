/* =========================================================
   SeccionResenas.tsx — COMENTARIOS Y RESEÑAS DE UN PRODUCTO
   Se muestra al final del detalle del producto.

   - Lista: las reseñas del producto + las que escribieron los
     usuarios (guardadas en localStorage, ver data/resenas.ts).
   - Con sesión iniciada: botón ESCRIBIR RESEÑA, que abre un
     formulario con estrellas y texto. La reseña se publica con
     el usuario de la sesión ("@nombre").
   - Sin sesión: un enlace para iniciar sesión.
   ========================================================= */

import { useState, type FormEvent } from 'react'
import { Link, useOutletContext } from 'react-router'

import type { Producto, Resena } from '../data/productos'
import { guardarResena, leerResenas, textoEstrellas } from '../data/resenas'
import { useAuth } from '../layout/Auth/Auth'
import type { ContextoMain } from '../layout/Main/Main'

interface SeccionResenasProps {
  producto: Producto
}

function SeccionResenas({ producto }: SeccionResenasProps) {
  const { user } = useAuth() // null si no hay sesión
  const { mostrarMensaje } = useOutletContext<ContextoMain>()

  /* Reseñas que escribieron los usuarios para ESTE producto. */
  const [resenasGuardadas, setResenasGuardadas] = useState<Resena[]>(() => leerResenas(producto.id))

  /* Estado del formulario. */
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const [estrellas, setEstrellas] = useState(5) // de 1 a 5
  const [texto, setTexto] = useState('')
  const [error, setError] = useState('')

  /* Todas las reseñas: las del producto + las de los usuarios. */
  const resenas = [...producto.resenas, ...resenasGuardadas]

  function cerrarFormulario() {
    setFormularioAbierto(false)
    setEstrellas(5)
    setTexto('')
    setError('')
  }

  function publicar(evento: FormEvent) {
    evento.preventDefault()
    if (!user) return

    if (texto.trim().length === 0) {
      setError('Escribe tu comentario antes de publicar.')
      return
    }

    const nueva: Resena = {
      autor: '@' + user.nombre, // el usuario de la sesión
      estrellas: textoEstrellas(estrellas), // 4 → "★★★★☆"
      texto: texto.trim(),
    }

    if (!guardarResena(producto.id, nueva)) {
      setError('No fue posible guardar la reseña en este navegador.')
      return
    }

    // Actualizamos la lista en pantalla con un arreglo nuevo (no se muta el estado).
    setResenasGuardadas([...resenasGuardadas, nueva])
    cerrarFormulario()
    mostrarMensaje('¡Gracias! Tu reseña se publicó.')
  }

  return (
    <section className="resenas">
      <h2>COMENTARIOS Y RESEÑAS</h2>

      {/* ---------- ESCRIBIR UNA RESEÑA ---------- */}
      {!user && (
        <p className="nota-resena">
          <Link to="/login">Inicia sesión</Link> para escribir una reseña.
        </p>
      )}

      {user && !formularioAbierto && (
        <button className="boton-resena" type="button" onClick={() => setFormularioAbierto(true)}>
          ESCRIBIR RESEÑA
        </button>
      )}

      {user && formularioAbierto && (
        <form className="form-resena" onSubmit={publicar}>
          <p className="nota-resena">
            Escribiendo como <strong>@{user.nombre}</strong>
          </p>

          {/* Estrellas: 5 botones. Las que están hasta la elegida se pintan. */}
          <fieldset className="estrellas-resena">
            <legend>CALIFICACIÓN</legend>
            {[1, 2, 3, 4, 5].map((numero) => (
              <button
                key={numero}
                type="button"
                className={numero <= estrellas ? 'activa' : undefined}
                aria-label={numero + (numero === 1 ? ' estrella' : ' estrellas')}
                aria-pressed={numero === estrellas}
                onClick={() => setEstrellas(numero)}
              >
                ★
              </button>
            ))}
          </fieldset>

          <label className="solo-lectores" htmlFor="texto-resena">
            Comentario
          </label>
          <textarea
            id="texto-resena"
            maxLength={500}
            placeholder="Cuéntale a otros fans qué te pareció…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />

          <div className="acciones-resena">
            <button className="boton-publicar-resena" type="submit">
              PUBLICAR
            </button>
            <button className="boton-resena" type="button" onClick={cerrarFormulario}>
              CANCELAR
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
        {resenas.length === 0 && <p>Este producto aún no tiene reseñas.</p>}
      </div>
    </section>
  )
}

export default SeccionResenas
