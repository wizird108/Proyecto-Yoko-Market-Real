import { useCatalogo } from "../../store/store";
/* =========================================================
   Home.tsx — PÁGINA DE INICIO (ruta "/")
   Reemplaza a homepage.js del original:
     1. Hero azul "NUEVA COLECCIÓN SAYONARA".
     2. Tres secciones de productos: Destacados Felicilandia,
        Tienda Oficial y Reventa.
   ========================================================= */

import { Link } from "react-router";

import ProductCard from "../../components/ProductCard";
import { leerPublicaciones, todosLosProductos } from "../../data/productos";
import useTitulo from "../../hooks/useTitulo";

function Home() {
  useCatalogo();
  useTitulo("YokoMarket | Home");

  /* Las tres secciones, igual que el original.
     .slice(0, 4) toma los primeros 4 productos de cada lista. */
  const productos = todosLosProductos().filter((producto) => producto.oficial);
  const secciones = [
    { titulo: "Felicilandia Highlights", lista: productos.slice(0, 4) },
    { titulo: "Official Store", lista: productos.slice(0, 4) },
    { titulo: "Resale", lista: leerPublicaciones().slice(0, 4) },
  ];

  return (
    <>
      {/* 1. HERO */}
      <section className="hero-home" aria-labelledby="titulo-home">
        <p className="presentacion">YOKOMARKET PRESENTS</p>
        <h1 id="titulo-home">
          NEW COLLECTION
          <br />
          SAYONARA
        </h1>
        <p>Official merch and unique pieces for a memorable farewell.</p>
        <Link className="boton-coleccion" to="/ropa">
          VIEW COLLECTION
        </Link>
      </section>

      {/* 2. SECCIONES: .map() crea una <section> por cada elemento del arreglo */}
      {secciones.map((seccion) => (
        <section key={seccion.titulo} className="seccion-home">
          <h2 className="titulo-seccion">{seccion.titulo}</h2>

          {/* Dentro, otro .map() crea una tarjeta por producto */}
          <div className="grilla-productos grilla-home">
            {seccion.lista.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>

          {/* Si la lista está vacía (pasa en Reventa al principio), avisamos */}
          {seccion.lista.length === 0 && <p>No community listings yet.</p>}
        </section>
      ))}
    </>
  );
}

export default Home;
