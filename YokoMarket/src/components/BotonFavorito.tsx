/* =========================================================
   BotonFavorito.tsx — BOTÓN DE CORAZÓN (♡ / ♥)
   Igual que crearBotonFavorito() de interacciones.js.
   Se usa en las tarjetas y en el detalle del producto.

   Lee y cambia los favoritos del contexto global
   (FavoritosContext), así todos los corazones del mismo
   producto y la Wishlist del perfil cambian a la vez, y la
   lista se sincroniza por cuenta (o queda local para invitados).
   ========================================================= */

import { useFavoritos } from "../context/FavoritosContext";

interface BotonFavoritoProps {
  productoId: number | string;
}

function BotonFavorito({ productoId }: BotonFavoritoProps) {
  const { esFavorito, alternarFavorito, pendiente } = useFavoritos();
  const activo = esFavorito(productoId);

  return (
    /* El CSS lo pinta de rojo cuando aria-pressed es "true". */
    <button
      className="boton-favorito"
      type="button"
      disabled={pendiente}
      aria-pressed={activo}
      aria-label={activo ? "Remove from wishlist" : "Add to wishlist"}
      onClick={() => alternarFavorito(productoId)}
    >
      {activo ? "♥" : "♡"}
    </button>
  );
}

export default BotonFavorito;
