/* =========================================================
   BotonFavorito.tsx — BOTÓN DE CORAZÓN (♡ / ♥)
   Igual que crearBotonFavorito() de interacciones.js.
   Se usa en las tarjetas y en el detalle del producto.

   Por ahora cada corazón recuerda su estado solo mientras la
   página está abierta (useState). Mi compañero lo conectará a
   un contexto de favoritos con localStorage: como todos los
   corazones usan este componente, basta con cambiarlo aquí.
   ========================================================= */

import { useState } from 'react'

function BotonFavorito() {
  const [favorito, setFavorito] = useState(false)

  return (
    /* El CSS lo pinta de rojo cuando aria-pressed es "true". */
    <button
      className="boton-favorito"
      type="button"
      aria-pressed={favorito}
      aria-label={favorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      onClick={() => setFavorito(!favorito)}
    >
      {favorito ? '♥' : '♡'}
    </button>
  )
}

export default BotonFavorito
