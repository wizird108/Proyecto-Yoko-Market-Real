/* =========================================================
   Home.tsx — PÁGINA DE INICIO (ruta "/")
   Reemplaza a homepage.js del original:
     1. Hero azul "NUEVA COLECCIÓN SAYONARA".
     2. Tres secciones de productos: Destacados Felicilandia,
        Tienda Oficial y Reventa.
   ========================================================= */

import { Link } from 'react-router'

import ProductCard from '../../components/ProductCard'
import { leerPublicaciones, productos } from '../../data/productos'
import useTitulo from '../../hooks/useTitulo'

function Home() {
  useTitulo('YokoMarket | Inicio')

  /* Las tres secciones, igual que el original.
     .slice(0, 4) toma los primeros 4 productos de cada lista. */
  const secciones = [
    { titulo: 'Destacados Felicilandia', lista: productos.slice(0, 4) },
    { titulo: 'Tienda Oficial', lista: productos.slice(0, 4) },
    { titulo: 'Reventa', lista: leerPublicaciones().slice(0, 4) },
  ]

  return (
    <>
      {/* 1. HERO */}
      <section className="hero-home" aria-labelledby="titulo-home">
        <p className="presentacion">YOKOMARKET PRESENTA</p>
        <h1 id="titulo-home">
          NUEVA COLECCIÓN
          <br />
          SAYONARA
        </h1>
        <p>Merch oficial y piezas únicas para despedirse a lo grande.</p>
        <Link className="boton-coleccion" to="/ropa">
          VER COLECCIÓN
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
          {seccion.lista.length === 0 && <p>Todavía no hay publicaciones de usuarios.</p>}
        </section>
      ))}
    </>
  )
}

export default Home
