/* =========================================================
   Perfil.tsx — MI PERFIL (ruta "/perfil", pide sesión)
   Reemplaza a perfil.html + perfil.js del original:
     1. Resumen: inicial, @nombre, correo, cerrar sesión y
        tres números (anuncios, ítems en la bolsa, wishlist).
     2. Mis anuncios: lo que este usuario ha publicado.
     3. Wishlist: los productos con corazón.
   Los números y la Wishlist salen de los contextos globales,
   así que cambian solos si tocas un corazón o la bolsa.
   ========================================================= */

import { Link, useNavigate } from 'react-router'

import ImagenProducto from '../../components/ImagenProducto'
import ProductCard from '../../components/ProductCard'
import { useCarrito } from '../../context/CarritoContext'
import { useFavoritos } from '../../context/FavoritosContext'
import { buscarProducto, leerPublicaciones, type Producto } from '../../data/productos'
import useTitulo from '../../hooks/useTitulo'
import { useAuth } from '../../layout/Auth/Auth'
import { precioTexto } from '../../utils/formato'

function Perfil() {
  useTitulo('Mi perfil | YokoMarket')

  const { user, logout } = useAuth()
  const { cantidadTotal } = useCarrito()
  const { favoritos } = useFavoritos()
  const navigate = useNavigate()

  /* RutaProtegida ya garantiza que hay sesión; esto solo tranquiliza a TypeScript. */
  if (!user) return null

  /* Publicaciones de ESTE usuario. */
  const misAnuncios = leerPublicaciones().filter((producto) => producto.usuarioId === user.id)

  /* Productos de la Wishlist. Saltamos ids de productos que ya no existen.
     "is Producto" le confirma a TypeScript que después del filtro no queda undefined. */
  const wishlist = favoritos
    .map((id) => buscarProducto(id))
    .filter((producto): producto is Producto => producto !== undefined)

  function cerrarSesion() {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* ---------- 1. RESUMEN ---------- */}
      <section className="perfil-resumen">
        {/* charAt(0) = primera letra del nombre */}
        <div aria-hidden="true" className="avatar-texto" id="avatar-texto">
          {user.nombre.charAt(0).toUpperCase()}
        </div>
        <div className="identidad">
          <h1 id="nombre-perfil">@{user.nombre}</h1>
          <p id="correo-perfil">{user.correo}</p>
          <button className="boton-texto" id="cerrar-sesion" type="button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
        <div className="estadistica">
          <strong id="cantidad-anuncios">{misAnuncios.length}</strong>
          <span>PRODUCTOS ACTIVOS</span>
        </div>
        <div className="estadistica">
          <strong id="cantidad-carrito">{cantidadTotal}</strong>
          <span>ÍTEMS EN MI BOLSA</span>
        </div>
        <div className="estadistica">
          <strong id="cantidad-favoritos">{wishlist.length}</strong>
          <span>EN MI WISHLIST</span>
        </div>
      </section>

      <section className="dashboard-layout">
        {/* ---------- 2. MIS ANUNCIOS ---------- */}
        <div className="panel anuncios-panel">
          <div className="fila-titulo">
            <h2>MIS ANUNCIOS</h2>
            <Link className="boton-principal" to="/publicar">
              + PUBLICAR PRODUCTO
            </Link>
          </div>
          <div id="mis-anuncios">
            {misAnuncios.map((producto) => (
              <article key={producto.id} className="fila-anuncio">
                <ImagenProducto producto={producto} />
                <Link to={`/producto/${producto.id}`}>{producto.nombre}</Link>
                <p className="precio">{precioTexto(producto.precio)}</p>
                <span>ACTIVO</span>
              </article>
            ))}
            {misAnuncios.length === 0 && <p className="estado-vacio">Todavía no has publicado productos.</p>}
          </div>
        </div>

        {/* ---------- 3. WISHLIST ---------- */}
        <aside className="panel resumen-panel">
          <h2>WISHLIST</h2>
          <div id="lista-wishlist">
            {wishlist.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
            {wishlist.length === 0 && (
              <p className="estado-vacio">Guarda productos con el corazón para verlos aquí.</p>
            )}
          </div>
        </aside>
      </section>
    </>
  )
}

export default Perfil
