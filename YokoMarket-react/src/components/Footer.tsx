/* =========================================================
   Footer.tsx — PIE DE PÁGINA DE TODAS LAS PÁGINAS
   Reemplaza al footer de componentes.js del proyecto original.
   Mismas cuatro columnas, textos y clases (style.css).
   ========================================================= */

import { Link } from 'react-router'

/* Igual que el Header, recibe onAccion para avisar al layout
   cuando se pulsa un botón (Vender, Mi perfil, Wishlist...). */
interface FooterProps {
  onAccion: (accion: string) => void
}

function Footer({ onAccion }: FooterProps) {
  return (
    <footer className="pie-pagina">
      {/* Columna 1: logo y lema */}
      <div>
        <p className="logo">YOKOMARKET</p>
        <p className="lema">Merch oficial + reventa entre fans.</p>
      </div>

      {/* Columna 2: enlaces a las categorías */}
      <nav aria-label="Explorar">
        <h2>EXPLORAR</h2>
        <Link to="/ropa">Ropa</Link>
        <Link to="/peluches">Peluches</Link>
        <Link to="/vinilos">Vinilos</Link>
        <Link to="/sale">Sale</Link>
      </nav>

      {/* Columna 3: comunidad. Son botones, no enlaces, igual que en el
          original: el layout decide a dónde ir con cada acción. */}
      <nav aria-label="Comunidad">
        <h2>COMUNIDAD</h2>
        <button type="button" onClick={() => onAccion('vender')}>
          Vender
        </button>
        <button aria-label="Perfil" type="button" onClick={() => onAccion('perfil')}>
          Mi perfil
        </button>
        <button type="button" onClick={() => onAccion('wishlist')}>
          Wishlist
        </button>
        <button type="button" onClick={() => onAccion('ayuda')}>
          Ayuda
        </button>
      </nav>

      {/* Columna 4: redes sociales (en el original solo muestran un aviso) */}
      <nav aria-label="Síguenos">
        <h2>SÍGUENOS</h2>
        <button type="button" onClick={() => onAccion('instagram')}>
          Instagram
        </button>
        <button type="button" onClick={() => onAccion('tiktok')}>
          TikTok
        </button>
        <button type="button" onClick={() => onAccion('twitter')}>
          X / Twitter
        </button>
      </nav>
    </footer>
  )
}

export default Footer
