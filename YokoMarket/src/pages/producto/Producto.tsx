import { useCatalogo } from "../../store/store";
/* =========================================================
   Producto.tsx — DETALLE DE UN PRODUCTO (ruta "/producto/:id")
   Reemplaza a detalle.js del original.
   En el original el id venía en la URL así: producto.html?id=3
   Aquí viene como parte de la ruta: /producto/3 (S10, useParams).

   Partes de la página:
     1. Foto (y botones "Foto 1, 2, 3" si es una publicación).
     2. Información: etiqueta, nombre, precio, estado, ubicación,
        vendedor y descripción.
     3. Tallas (si el producto tiene).
     4. Botones: favorito, CONTACTAR y AÑADIR AL CARRITO.
     5. Reseñas (componente SeccionResenas).
   ========================================================= */

import { Fragment, useState } from "react";
import { useOutletContext, useParams } from "react-router";

import BotonFavorito from "../../components/BotonFavorito";
import ImagenProducto from "../../components/ImagenProducto";
import SeccionResenas from "../../components/SeccionResenas";
import { useCarrito } from "../../context/CarritoContext";
import { buscarProducto } from "../../data/productos";
import useTitulo from "../../hooks/useTitulo";
import type { ContextoMain } from "../../layout/Main/Main";
import { precioTexto } from "../../utils/formato";

/* Componente de la ruta. Solo lee el id de la URL y dibuja el detalle.
   useParams lee la parte variable de la ruta: en /producto/3, id = "3".
   key={id}: si pasas de /producto/3 a /producto/8 (por ejemplo desde el
   buscador), React crea el detalle de nuevo y la talla y la foto elegidas
   vuelven a empezar, como al abrir otro HTML en el original. */
function Producto() {
  const { id = "" } = useParams();
  return <DetalleProducto key={id} id={id} />;
}

interface DetalleProductoProps {
  id: string;
}

function DetalleProducto({ id }: DetalleProductoProps) {
  useCatalogo();
  const producto = buscarProducto(id);

  const { mostrarMensaje, abrirBolsa } = useOutletContext<ContextoMain>();
  const { agregar, pendiente } = useCarrito();

  useTitulo(
    producto
      ? producto.nombre + " | YokoMarket"
      : "Product not found | YokoMarket",
  );

  /* Talla elegida. Si es una publicación con una sola talla, ya viene marcada. */
  const [tallaElegida, setTallaElegida] = useState(producto?.talla ?? "");

  /* Foto que se está mostrando (las publicaciones pueden tener varias). */
  const [fotoElegida, setFotoElegida] = useState(producto?.imagen);

  /* Si el id no existe (por ejemplo /producto/999), avisamos. */
  if (!producto) {
    return <h1 className="producto-no-encontrado">Product not found</h1>;
  }

  /* Botón CONTACTAR: igual que el original, solo muestra un aviso. */
  function contactar() {
    mostrarMensaje(
      producto?.vendedor
        ? "Seller:" + producto.vendedor
        : "Seller information unavailable.",
    );
  }

  /* Botón AÑADIR AL CARRITO (igual que el original):
     1. Si el producto tiene tallas, hay que elegir una.
     2. Se agrega a la bolsa (contexto global) y se abre el panel de la bolsa. */
  function anadirAlCarrito() {
    if (!producto) return;
    if (producto.tallas.length > 0 && !producto.tallas.includes(tallaElegida)) {
      mostrarMensaje("Choose a size before adding this product.");
      return;
    }
    agregar(producto.id, tallaElegida || null); // sin tallas → null
    abrirBolsa();
  }

  return (
    <>
      <section className="detalle-principal">
        {/* ---------- 1. FOTO ---------- */}
        <div className="galeria-producto">
          {/* key: al cambiar de foto, React crea la imagen de nuevo
              (así se reinicia si una foto anterior había fallado). */}
          <ImagenProducto
            key={fotoElegida}
            producto={{ ...producto, imagen: fotoElegida }}
          />

          {/* Publicaciones con varias fotos: un botón por foto. */}
          {producto.fotos && (
            <div className="controles-fotos">
              {producto.fotos.map(
                (foto, indice) =>
                  foto && (
                    <button
                      key={indice}
                      type="button"
                      onClick={() => setFotoElegida(foto)}
                    >
                      Photo {indice + 1}
                    </button>
                  ),
              )}
            </div>
          )}
        </div>

        {/* ---------- 2. INFORMACIÓN ---------- */}
        <div className="detalle-informacion">
          <span className="etiqueta-detalle">
            {producto.oficial ? "OFFICIAL" : "COMMUNITY"}
          </span>
          <h1>{producto.nombre}</h1>
          <p className="precio-detalle">{precioTexto(producto.precio)}</p>
          {producto.estado && <p>{producto.estado}</p>}
          {producto.ubicacion && <p>Location: {producto.ubicacion}</p>}
          {producto.vendedor && <p>Listed by {producto.vendedor}</p>}
          <p className="descripcion">
            {producto.descripcion || "No description available."}
          </p>

          {/* ---------- 3. TALLAS ----------
              Radios ocultos con su label (el label es el cuadrito que se ve).
              Al elegir uno, el CSS lo pinta de azul (:checked). */}
          {producto.tallas.length > 0 && (
            <fieldset className="selector-tallas">
              <legend>CHOOSE YOUR SIZE</legend>
              {producto.tallas.map((talla) => (
                /* Fragment con key: agrupa el input y su label sin agregar etiquetas. */
                <Fragment key={talla}>
                  <input
                    id={"talla-" + talla}
                    name="talla"
                    type="radio"
                    value={talla}
                    checked={tallaElegida === talla}
                    onChange={() => setTallaElegida(talla)}
                  />
                  <label htmlFor={"talla-" + talla}>{talla}</label>
                </Fragment>
              ))}
            </fieldset>
          )}

          {/* ---------- 4. BOTONES ---------- */}
          <div className="acciones-detalle">
            <BotonFavorito productoId={producto.id} />
            <button
              className="boton-contactar"
              type="button"
              onClick={contactar}
            >
              CONTACT
            </button>
            <button
              className="boton-carrito"
              type="button"
              disabled={pendiente}
              onClick={anadirAlCarrito}
            >
              ADD TO BAG
            </button>
          </div>
        </div>
      </section>

      {/* ---------- 5. RESEÑAS ----------
          En su propio componente: lista + formulario para escribir una
          reseña (solo con sesión iniciada). */}
      <SeccionResenas producto={producto} />
    </>
  );
}

export default Producto;
