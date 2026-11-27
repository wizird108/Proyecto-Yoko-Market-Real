import { useCatalogo } from "../../store/store";
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

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import ImagenProducto from "../../components/ImagenProducto";
import ProductCard from "../../components/ProductCard";
import { useCarrito } from "../../context/CarritoContext";
import { useFavoritos } from "../../context/FavoritosContext";
import {
  buscarProducto,
  leerPublicaciones,
  type Producto,
} from "../../data/productos";
import useTitulo from "../../hooks/useTitulo";
import { useAuth } from "../../layout/Auth/Auth";
import { precioTexto } from "../../utils/formato";

function Perfil() {
  useCatalogo();
  useTitulo("My profile | YokoMarket");

  const { user, logout, editarPerfil } = useAuth();
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [aviso, setAviso] = useState("");
  const [guardando, setGuardando] = useState(false);
  const { cantidadTotal } = useCarrito();
  const { favoritos } = useFavoritos();
  const navigate = useNavigate();

  /* RutaProtegida ya garantiza que hay sesión; esto solo tranquiliza a TypeScript. */
  if (!user) return null;

  /* Publicaciones de ESTE usuario. */
  const misAnuncios = leerPublicaciones().filter(
    (producto) => producto.usuarioId === user.id,
  );

  /* Productos de la Wishlist. Saltamos ids de productos que ya no existen.
     "is Producto" le confirma a TypeScript que después del filtro no queda undefined. */
  const wishlist = favoritos
    .map((id) => buscarProducto(id))
    .filter((producto): producto is Producto => producto !== undefined);

  async function cerrarSesion() {
    try {
      await logout();
      navigate("/login");
    } catch {
      setAviso("Unable to sign out. Please retry.");
    }
  }
  async function guardarPerfil(evento: FormEvent) {
    evento.preventDefault();
    setGuardando(true);
    try {
      await editarPerfil(nombre, bio);
      setEditando(false);
      setAviso("Profile updated.");
    } catch {
      setAviso("Unable to save your profile. Please retry.");
    } finally {
      setGuardando(false);
    }
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
          <p>{user.bio}</p>
          <button
            className="boton-texto"
            id="cerrar-sesion"
            type="button"
            onClick={cerrarSesion}
          >
            Sign out
          </button>
          <button
            className="boton-texto editar-perfil-boton"
            type="button"
            aria-expanded={editando}
            onClick={() => {
              setNombre(user.nombre);
              setBio(user.bio || "");
              setEditando(!editando);
            }}
          >
            Edit profile
          </button>
        </div>
        <div className="estadistica">
          <strong id="cantidad-anuncios">{misAnuncios.length}</strong>
          <span>ACTIVE LISTINGS</span>
        </div>
        <div className="estadistica">
          <strong id="cantidad-carrito">{cantidadTotal}</strong>
          <span>ITEMS IN MY BAG</span>
        </div>
        <div className="estadistica">
          <strong id="cantidad-favoritos">{wishlist.length}</strong>
          <span>IN MY WISHLIST</span>
        </div>
      </section>

      <div className="perfil-edicion">
        {aviso && <p role="status">{aviso}</p>}
        {editando && (
          <form className="panel editar-perfil" onSubmit={guardarPerfil}>
            <div className="campo">
              <label htmlFor="editar-nombre">Display name</label>
              <input
                id="editar-nombre"
                required
                maxLength={40}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="campo">
              <label htmlFor="editar-bio">About you</label>
              <textarea
                id="editar-bio"
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <button
              className="boton-principal"
              type="submit"
              disabled={guardando}
            >
              Save profile
            </button>
          </form>
        )}
      </div>
      <section className="dashboard-layout">
        {/* ---------- 2. MIS ANUNCIOS ---------- */}
        <div className="panel anuncios-panel">
          <div className="fila-titulo">
            <h2>MY LISTINGS</h2>
            <Link className="boton-principal" to="/publicar">
              + SELL AN ITEM
            </Link>
          </div>
          <div id="mis-anuncios">
            {misAnuncios.map((producto) => (
              <article key={producto.id} className="fila-anuncio">
                <ImagenProducto producto={producto} />
                <Link to={`/producto/${producto.id}`}>{producto.nombre}</Link>
                <p className="precio">{precioTexto(producto.precio)}</p>
                <span>ACTIVE</span>
              </article>
            ))}
            {misAnuncios.length === 0 && (
              <p className="estado-vacio">
                You have not listed any products yet.
              </p>
            )}
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
              <p className="estado-vacio">
                Tap the heart on a product to save it here.
              </p>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}

export default Perfil;
