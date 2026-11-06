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

import { useState, type CSSProperties } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router'

import ImagenProducto from '../../components/ImagenProducto'
import ProductCard from '../../components/ProductCard'
import { CATALOGOS, buscarProducto, todosLosProductos } from '../../data/productos'
import useTitulo from '../../hooks/useTitulo'
import type { ContextoMain } from '../../layout/Main/Main'
import { precioTexto } from '../../utils/formato'

// Imágenes de los banners y de las tarjetas de estilos
import cocoVerde from '../../assets/images/coco-verde.png'
import cocoSaleBanner from '../../assets/images/coco-sale-banner.png'
import tileOversize from '../../assets/images/tile-oversize.png'
import tileBaggy from '../../assets/images/tile-baggy.png'
import tileGraficos from '../../assets/images/tile-graficos.png'
import tileBasicos from '../../assets/images/tile-basicos.png'

/* Tarjetas de estilos de ropa (iguales al original). */
const estilosRopa = [
  { texto: 'Oversize', imagen: tileOversize },
  { texto: 'Baggy', imagen: tileBaggy },
  { texto: 'Gráficos', imagen: tileGraficos },
  { texto: 'Basicos', imagen: tileBasicos },
]

/* Banner "favorito" (rosado en peluches). En el original solo existía en
   peluches; ahora también en vinilos y accesorios, cada uno con su texto,
   su producto destacado y su color (el color está en cambios.css). */
const bannersFavorito: Record<string, { titulo: string; texto: string; productoId: number }> = {
  peluches: {
    titulo: 'PELUCHE FAVORITO',
    texto: 'Elige a Coco y llévalo contigo a todas partes.',
    productoId: 8, // Chef Coco Plushie
  },
  vinilos: {
    titulo: 'VINILO FAVORITO',
    texto: 'Lleva OMAKASE a tu tocadiscos en edición picture disc.',
    productoId: 6, // OMAKASE 2LP Picture Disc Vinyl
  },
  accesorios: {
    titulo: 'ACCESORIO FAVORITO',
    texto: 'Completa tu look con el delantal oficial de OMAKASE.',
    productoId: 12, // OMAKASE Logo Chef Apron
  },
}

interface CatalogoProps {
  categoria: string // "ropa", "peluches", "vinilos", "accesorios" o "sale"
}

function Catalogo({ categoria }: CatalogoProps) {
  const configuracion = CATALOGOS[categoria]
  useTitulo(configuracion.titulo + ' | YokoMarket')

  const navigate = useNavigate()
  /* useOutletContext trae lo que el layout Main comparte con las
     páginas; aquí, la función para mostrar avisos abajo. */
  const { mostrarMensaje } = useOutletContext<ContextoMain>()

  /* ---------- ESTADO DE LOS FILTROS ----------
     Cada filtro guarda lo que el usuario eligió. '' = sin elegir. */
  const [genero, setGenero] = useState('')
  const [destino, setDestino] = useState('') // select "Categoría"
  const [ubicacion, setUbicacion] = useState('')
  const [orden, setOrden] = useState('') // "menor" o "mayor"
  const [estado, setEstado] = useState('')
  const [talla, setTalla] = useState('')

  /* ---------- PRODUCTOS DE ESTA CATEGORÍA ----------
     Sale muestra todo lo que esté en oferta; accesorios incluye
     también los bolsos (igual que el original). */
  const productosCategoria = todosLosProductos().filter((producto) => {
    if (categoria === 'sale') return producto.oferta
    return (
      producto.categoria === categoria ||
      (categoria === 'accesorios' && producto.categoria === 'bolsos')
    )
  })

  /* ---------- OPCIONES DE LOS SELECTS ----------
     Salen de los productos (no inventamos opciones).
     new Set(...) quita los repetidos; [...] lo vuelve arreglo. */
  const ubicaciones = [...new Set(productosCategoria.map((p) => p.ubicacion))]
  const estados = [...new Set(productosCategoria.map((p) => p.estado))]
  const tallas = [...new Set(productosCategoria.flatMap((p) => p.tallas))]

  /* ---------- APLICAR FILTROS ----------
     Unisex aparece tanto en HOMBRE como en MUJER. */
  const seleccion = productosCategoria.filter(
    (producto) =>
      (genero === '' || producto.genero === genero || producto.genero === 'unisex') &&
      (ubicacion === '' || producto.ubicacion === ubicacion) &&
      (estado === '' || producto.estado === estado) &&
      (talla === '' || producto.tallas.includes(talla)),
  )

  /* Ordenar por precio. sort() cambia el arreglo, pero seleccion ya
     es un arreglo nuevo (lo creó filter), así que no daña los datos. */
  if (orden === 'menor') seleccion.sort((a, b) => a.precio - b.precio)
  if (orden === 'mayor') seleccion.sort((a, b) => b.precio - a.precio)

  /* El select "Categoría" lleva a otro catálogo. */
  function cambiarCategoria(valor: string) {
    setDestino(valor)
    if (valor !== '' && valor !== categoria) navigate('/' + valor)
  }

  /* Botón "Limpiar filtros": todo vuelve a ''. */
  function limpiarFiltros() {
    setGenero('')
    setDestino('')
    setUbicacion('')
    setOrden('')
    setEstado('')
    setTalla('')
  }

  /* Banner "favorito" de esta categoría (undefined si no tiene) y su producto. */
  const bannerFavorito = bannersFavorito[categoria]
  const productoBanner = bannerFavorito ? buscarProducto(bannerFavorito.productoId) : undefined

  return (
    /* Las clases y la variable --color-catalogo las ponía el original
       en <main>. El CSS las usa para pintar cada catálogo de su color.
       "as CSSProperties" le dice a TypeScript que la variable es válida. */
    <div
      className={`catalogo catalogo-${categoria}`}
      style={{ '--color-catalogo': configuracion.color } as CSSProperties}
    >
      {/* ---------- 1. BANNER ---------- */}
      {(categoria === 'ropa' || categoria === 'sale') && (
        <section className="banner-promocion" aria-label={'Promoción de ' + configuracion.titulo}>
          <img alt="" className="personaje-promo" src={categoria === 'ropa' ? cocoVerde : cocoSaleBanner} />
          <p>{categoria === 'ropa' ? 'PRODUCTOS OFICIALES · ÁLVARO DÍAZ' : 'SALE'}</p>
          <img
            alt=""
            className="personaje-promo personaje-espejo"
            src={categoria === 'ropa' ? cocoVerde : cocoSaleBanner}
          />
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
              COMPRAR YA
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
          <legend className="solo-lectores">Sección de género</legend>
          <input
            id="hombre"
            name="genero"
            type="radio"
            value="hombre"
            checked={genero === 'hombre'}
            onChange={(evento) => setGenero(evento.target.value)}
          />
          <label htmlFor="hombre">HOMBRE</label>
          <input
            id="mujer"
            name="genero"
            type="radio"
            value="mujer"
            checked={genero === 'mujer'}
            onChange={(evento) => setGenero(evento.target.value)}
          />
          <label htmlFor="mujer">MUJER</label>
        </fieldset>
      </section>

      {/* ---------- 3. ESTILOS (solo ropa) ----------
          En el original solo muestran un aviso: los productos no
          tienen el dato "estilo" para poder filtrar. */}
      {categoria === 'ropa' && (
        <div className="estilos-ropa">
          {estilosRopa.map((opcion, indice) => (
            <button
              key={opcion.texto}
              className={'estilo-ropa estilo-' + indice}
              type="button"
              onClick={() =>
                mostrarMensaje(
                  'Estilo seleccionado: ' +
                    opcion.texto +
                    '. El filtro de estilos estará disponible próximamente.',
                )
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
          aria-label="Filtros de productos"
          onSubmit={(evento) => evento.preventDefault()}
        >
          <h2>FILTRAR</h2>

          {/* Cada select es "controlado": value = estado, onChange = actualizar estado.
              Las etiquetas "solo-lectores" no se ven, pero las leen los lectores de pantalla. */}
          <label className="solo-lectores" htmlFor="filtro-categoria">
            Categoría
          </label>
          <select id="filtro-categoria" value={destino} onChange={(e) => cambiarCategoria(e.target.value)}>
            <option value="">Categoría ⌄</option>
            <option value="ropa">Ropa</option>
            <option value="peluches">Peluches</option>
            <option value="sale">Sale</option>
          </select>

          <label className="solo-lectores" htmlFor="filtro-ubicacion">
            Ubicación
          </label>
          <select
            id="filtro-ubicacion"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            hidden={ubicaciones.length === 0} // sin opciones, se oculta (igual que el original)
          >
            <option value="">Ubicación ⌄</option>
            {ubicaciones.map((valor) => (
              <option key={valor} value={valor}>
                {valor}
              </option>
            ))}
          </select>

          <label className="solo-lectores" htmlFor="filtro-precio">
            Precio
          </label>
          <select id="filtro-precio" value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="">Precio ⌄</option>
            <option value="menor">Menor a mayor</option>
            <option value="mayor">Mayor a menor</option>
          </select>

          <label className="solo-lectores" htmlFor="filtro-estado">
            Estado
          </label>
          <select
            id="filtro-estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            hidden={estados.length === 0}
          >
            <option value="">Estado ⌄</option>
            {estados.map((valor) => (
              <option key={valor} value={valor}>
                {valor}
              </option>
            ))}
          </select>

          <label className="solo-lectores" htmlFor="filtro-talla">
            Talla
          </label>
          <select
            id="filtro-talla"
            value={talla}
            onChange={(e) => setTalla(e.target.value)}
            hidden={tallas.length === 0}
          >
            <option value="">Talla ⌄</option>
            {tallas.map((valor) => (
              <option key={valor} value={valor}>
                {valor}
              </option>
            ))}
          </select>

          <button className="boton-texto" type="button" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </form>

        <div className="columna-productos">
          <div className="grilla-productos grilla-catalogo" id="lista-productos">
            {seleccion.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
          {/* Si ningún producto cumple los filtros, avisamos. */}
          <p className="aviso-catalogo" role="status">
            {seleccion.length === 0 ? 'No hay productos disponibles para esta selección.' : ''}
          </p>
        </div>
      </section>
    </div>
  )
}

export default Catalogo
