import { useCatalogo } from "../../store/store";
/* =========================================================
   Catalogo.tsx — PÁGINA DE CATÁLOGO
   Una sola página para las 5 categorías: ropa, peluches,
   vinilos, accesorios y sale. Reemplaza a catalogo.js del
   original. El router le pasa la categoría como prop.

   Partes de la página (en el mismo orden que el original):
     1. Banner (ropa y sale: promoción; peluches, vinilos y
        accesorios: "favorito" con un producto destacado).
     2. Título + selector HOMBRE / MUJER.
     3. Tarjetas de estilos (solo ropa).
     4. Filtros + grilla de productos.
   ========================================================= */

import { useState, type CSSProperties } from "react";
import { Link, useNavigate } from "react-router";

import ImagenProducto from "../../components/ImagenProducto";
import ProductCard from "../../components/ProductCard";
import {
  CATALOGOS,
  buscarProducto,
  todosLosProductos,
} from "../../data/productos";
import useTitulo from "../../hooks/useTitulo";
import { precioTexto } from "../../utils/formato";

// Imágenes de los banners y de las tarjetas de estilos
import cocoVerde from "../../assets/images/coco-verde.png";
import cocoSaleBanner from "../../assets/images/coco-sale-banner.png";
import tileOversize from "../../assets/images/tile-oversize.png";
import tileBaggy from "../../assets/images/tile-baggy.png";
import tileGraficos from "../../assets/images/tile-graficos.png";
import tileBasicos from "../../assets/images/tile-basicos.png";

/* Tarjetas de estilos de ropa (iguales al original). */
const estilosRopa = [
  { texto: "Oversize", imagen: tileOversize },
  { texto: "Baggy", imagen: tileBaggy },
  { texto: "Graphics", imagen: tileGraficos },
  { texto: "Basics", imagen: tileBasicos },
];

/* Banner "favorito" (rosado en peluches). En el original solo existía en
   peluches; ahora también en vinilos y accesorios, cada uno con su texto,
   su producto destacado y su color (el color está en cambios.css). */
const bannersFavorito: Record<
  string,
  { titulo: string; texto: string; productoId: number }
> = {
  peluches: {
    titulo: "FEATURED PLUSHIE",
    texto: "Choose Coco and take him everywhere.",
    productoId: 8, // Chef Coco Plushie
  },
  vinilos: {
    titulo: "FEATURED VINYL",
    texto: "Bring OMAKASE to your turntable with the picture disc edition.",
    productoId: 6, // OMAKASE 2LP Picture Disc Vinyl
  },
  accesorios: {
    titulo: "FEATURED ACCESSORY",
    texto: "Complete your look with the official OMAKASE apron.",
    productoId: 12, // OMAKASE Logo Chef Apron
  },
};

interface CatalogoProps {
  categoria: string; // "ropa", "peluches", "vinilos", "accesorios" o "sale"
}

function Catalogo({ categoria }: CatalogoProps) {
  useCatalogo();
  const configuracion = CATALOGOS[categoria];
  useTitulo(configuracion.titulo + " | YokoMarket");

  const navigate = useNavigate();
  /* ---------- ESTADO DE LOS FILTROS ----------
     Cada filtro guarda lo que el usuario eligió. '' = sin elegir. */
  const [estilo, setEstilo] = useState("");
  const [genero, setGenero] = useState("");
  const [destino, setDestino] = useState(""); // select "Categoría"
  const [ubicacion, setUbicacion] = useState("");
  const [orden, setOrden] = useState(""); // "menor" o "mayor"
  const [estado, setEstado] = useState("");
  const [talla, setTalla] = useState("");

  /* ---------- PRODUCTOS DE ESTA CATEGORÍA ----------
     Sale muestra todo lo que esté en oferta; accesorios incluye
     también los bolsos (igual que el original). */
  const productosCategoria = todosLosProductos().filter((producto) => {
    if (categoria === "sale") return producto.oferta;
    return (
      producto.categoria === categoria ||
      (categoria === "accesorios" && producto.categoria === "bolsos")
    );
  });

  /* ---------- OPCIONES DE LOS SELECTS ----------
     Salen de los productos (no inventamos opciones).
     new Set(...) quita los repetidos; [...] lo vuelve arreglo. */
  const ubicaciones = [...new Set(productosCategoria.map((p) => p.ubicacion))];
  const estados = [...new Set(productosCategoria.map((p) => p.estado))];
  const tallas = [...new Set(productosCategoria.flatMap((p) => p.tallas))];

  /* ---------- APLICAR FILTROS ----------
     Unisex aparece tanto en HOMBRE como en MUJER. */
  const seleccion = productosCategoria.filter(
    (producto) =>
      (genero === "" ||
        producto.genero === genero ||
        producto.genero === "unisex") &&
      (ubicacion === "" || producto.ubicacion === ubicacion) &&
      (estado === "" || producto.estado === estado) &&
      (talla === "" || producto.tallas.includes(talla)) &&
      (estilo === "" || producto.estilo === estilo),
  );

  /* Ordenar por precio. sort() cambia el arreglo, pero seleccion ya
     es un arreglo nuevo (lo creó filter), así que no daña los datos. */
  if (orden === "menor") seleccion.sort((a, b) => a.precio - b.precio);
  if (orden === "mayor") seleccion.sort((a, b) => b.precio - a.precio);

  /* El select "Categoría" lleva a otro catálogo. */
  function cambiarCategoria(valor: string) {
    setDestino(valor);
    if (valor !== "" && valor !== categoria) navigate("/" + valor);
  }

  /* Botón "Limpiar filtros": todo vuelve a ''. */
  function limpiarFiltros() {
    setEstilo("");
    setGenero("");
    setDestino("");
    setUbicacion("");
    setOrden("");
    setEstado("");
    setTalla("");
  }

  /* Banner "favorito" de esta categoría (undefined si no tiene) y su producto. */
  const bannerFavorito = bannersFavorito[categoria];
  const productoBanner = bannerFavorito
    ? buscarProducto(bannerFavorito.productoId)
    : undefined;

  return (
    /* Las clases y la variable --color-catalogo las ponía el original
       en <main>. El CSS las usa para pintar cada catálogo de su color.
       "as CSSProperties" le dice a TypeScript que la variable es válida. */
    <div
      className={`catalogo catalogo-${categoria}`}
      style={{ "--color-catalogo": configuracion.color } as CSSProperties}
    >
      {/* ---------- 1. BANNER ---------- */}
      {categoria === "ropa" && (
        <section
          className="banner-promocion"
          aria-label={"Promotion for" + configuracion.titulo}
        >
          <img
            alt=""
            className="personaje-promo"
            src={cocoVerde}
          />
          <p>
            OFFICIAL PRODUCTS · ÁLVARO DÍAZ
          </p>
          <img
            alt=""
            className="personaje-promo personaje-espejo"
            src={cocoVerde}
          />
        </section>
      )}

      {/* Sale comparte los márgenes y la distribución de los otros banners. */}
      {categoria === "sale" && (
        <section className="banner-peluches banner-sale">
          <div className="texto-banner">
            <h2>SALE</h2>
            <p>{configuracion.subtitulo}</p>
            <a className="boton-comprar" href="#productos">
              SHOP NOW
            </a>
          </div>
          <div className="personajes-sale" aria-hidden="true">
            <img alt="" src={cocoSaleBanner} />
            <img alt="" className="personaje-espejo" src={cocoSaleBanner} />
          </div>
        </section>
      )}

      {/* Usamos la clase "banner-peluches" del original en las tres
          categorías para reutilizar exactamente los mismos estilos. */}
      {bannerFavorito && productoBanner && (
        <section className="banner-peluches">
          <div className="texto-banner">
            <h2>{bannerFavorito.titulo}</h2>
            <p>{bannerFavorito.texto}</p>
            {/* #productos baja hasta la zona de productos (id="productos") */}
            <a className="boton-comprar" href="#productos">
              SHOP NOW
            </a>
          </div>
          <Link className="ficha-banner" to={`/producto/${productoBanner.id}`}>
            <ImagenProducto producto={productoBanner} />
            <div>
              <h3>{productoBanner.nombre}</h3>
              <p className="precio">{precioTexto(productoBanner.precio)}</p>
            </div>
          </Link>
        </section>
      )}

      {/* ---------- 2. TÍTULO + GÉNERO ---------- */}
      <section className="titulo-catalogo">
        <div>
          <h1>{configuracion.titulo}</h1>
          <p>{configuracion.subtitulo}</p>
        </div>
        {/* Radios "controlados": checked depende del estado y onChange lo cambia. */}
        <fieldset className="selector-genero">
          <legend className="solo-lectores">Gender section</legend>
          <input
            id="hombre"
            name="genero"
            type="radio"
            value="hombre"
            checked={genero === "hombre"}
            onChange={(evento) => setGenero(evento.target.value)}
          />
          <label htmlFor="hombre">MEN</label>
          <input
            id="mujer"
            name="genero"
            type="radio"
            value="mujer"
            checked={genero === "mujer"}
            onChange={(evento) => setGenero(evento.target.value)}
          />
          <label htmlFor="mujer">WOMEN</label>
        </fieldset>
      </section>

      {/* ---------- 3. ESTILOS (solo ropa) ----------
          Las tarjetas filtran por la etiqueta simulada de estilo.
          Repetir el clic quita el filtro. */}
      {categoria === "ropa" && (
        <div className="estilos-ropa">
          {estilosRopa.map((opcion, indice) => (
            <button
              key={opcion.texto}
              className={"estilo-ropa estilo-" + indice}
              type="button"
              aria-pressed={estilo === opcion.texto}
              onClick={() =>
                setEstilo(estilo === opcion.texto ? "" : opcion.texto)
              }
            >
              <img alt="" src={opcion.imagen} />
              <span>{opcion.texto}</span>
            </button>
          ))}
        </div>
      )}

      {/* ---------- 4. FILTROS + PRODUCTOS ---------- */}
      <section className="zona-catalogo" id="productos">
        {/* onSubmit con preventDefault: Enter no recarga la página. */}
        <form
          className="filtros-catalogo"
          aria-label="Product filters"
          onSubmit={(evento) => evento.preventDefault()}
        >
          <h2>FILTER</h2>

          {/* Cada select es "controlado": value = estado, onChange = actualizar estado.
              Las etiquetas "solo-lectores" no se ven, pero las leen los lectores de pantalla. */}
          <label className="solo-lectores" htmlFor="filtro-categoria">
            Category
          </label>
          <select
            id="filtro-categoria"
            value={destino}
            onChange={(e) => cambiarCategoria(e.target.value)}
          >
            <option value="">Category ⌄</option>
            <option value="ropa">Clothing</option>
            <option value="peluches">Plushies</option>
            <option value="vinilos">Vinyl</option>
            <option value="accesorios">Accessories</option>
            <option value="sale">Sale</option>
          </select>

          <label className="solo-lectores" htmlFor="filtro-ubicacion">
            Location
          </label>
          <select
            id="filtro-ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            hidden={ubicaciones.length === 0} // sin opciones, se oculta (igual que el original)
          >
            <option value="">Location ⌄</option>
            {ubicaciones.map((valor) => (
              <option key={valor} value={valor}>
                {valor}
              </option>
            ))}
          </select>

          <label className="solo-lectores" htmlFor="filtro-precio">
            Price
          </label>
          <select
            id="filtro-precio"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="">Price ⌄</option>
            <option value="menor">Lowest first</option>
            <option value="mayor">Highest first</option>
          </select>

          <label className="solo-lectores" htmlFor="filtro-estado">
            Condition
          </label>
          <select
            id="filtro-estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            hidden={estados.length === 0}
          >
            <option value="">Condition ⌄</option>
            {estados.map((valor) => (
              <option key={valor} value={valor}>
                {valor}
              </option>
            ))}
          </select>

          <label className="solo-lectores" htmlFor="filtro-talla">
            Size
          </label>
          <select
            id="filtro-talla"
            value={talla}
            onChange={(e) => setTalla(e.target.value)}
            hidden={tallas.length === 0}
          >
            <option value="">Size ⌄</option>
            {tallas.map((valor) => (
              <option key={valor} value={valor}>
                {valor}
              </option>
            ))}
          </select>

          <button
            className="boton-texto"
            type="button"
            onClick={limpiarFiltros}
          >
            Clear filters
          </button>
        </form>

        <div className="columna-productos">
          <div
            className="grilla-productos grilla-catalogo"
            id="lista-productos"
          >
            {seleccion.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
          {/* Si ningún producto cumple los filtros, avisamos. */}
          <p className="aviso-catalogo" role="status">
            {seleccion.length === 0 ? "No products match your selection." : ""}
          </p>
        </div>
      </section>
    </div>
  );
}

export default Catalogo;
