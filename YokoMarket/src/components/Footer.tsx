/* =========================================================
   Footer.tsx — PIE DE PÁGINA DE TODAS LAS PÁGINAS
   Reemplaza al footer de componentes.js del proyecto original.
   Mismas cuatro columnas, textos y clases (style.css).
   ========================================================= */

import { Link } from "react-router";

/* Redes sociales oficiales de Álvaro Díaz (las mismas que enlaza su
   tienda oficial, shop.alvarodiaz.com). En el original solo mostraban
   un aviso; ahora abren el perfil en otra pestaña (la rúbrica pide que
   todos los botones funcionen). Si un enlace cambia, se corrige aquí. */
const redes = [
  { texto: "Instagram", url: "https://www.instagram.com/alvaritodiaz/" },
  { texto: "TikTok", url: "https://www.tiktok.com/@alvaritodiaz" },
  { texto: "X / Twitter", url: "https://x.com/yoAlvaroDiaz" },
];

/* Igual que el Header, recibe onAccion para avisar al layout
   cuando se pulsa un botón (Vender, Mi perfil, Wishlist, Ayuda). */
interface FooterProps {
  onAccion: (accion: string) => void;
}

function Footer({ onAccion }: FooterProps) {
  return (
    <footer className="pie-pagina">
      {/* Columna 1: logo y lema */}
      <div>
        <p className="logo">YOKOMARKET</p>
        <p className="lema">Official merch + resale between fans.</p>
      </div>

      {/* Columna 2: enlaces a las categorías */}
      <nav aria-label="Explore">
        <h2>EXPLORE</h2>
        <Link to="/ropa">Clothing</Link>
        <Link to="/peluches">Plushies</Link>
        <Link to="/vinilos">Vinyl</Link>
        <Link to="/sale">Sale</Link>
      </nav>

      {/* Columna 3: comunidad. Son botones, no enlaces, igual que en el
          original: el layout decide a dónde ir con cada acción. */}
      <nav aria-label="Community">
        <h2>COMMUNITY</h2>
        <button type="button" onClick={() => onAccion("vender")}>
          Sell
        </button>
        <button
          aria-label="Profile"
          type="button"
          onClick={() => onAccion("perfil")}
        >
          My profile
        </button>
        <button type="button" onClick={() => onAccion("wishlist")}>
          Wishlist
        </button>
        <button type="button" onClick={() => onAccion("ayuda")}>
          Help
        </button>
      </nav>

      {/* Columna 4: redes sociales.
          target="_blank" abre otra pestaña; rel="noreferrer" es una
          medida de seguridad recomendada para enlaces externos. */}
      <nav aria-label="Follow us">
        <h2>FOLLOW US</h2>
        {redes.map((red) => (
          <a key={red.texto} href={red.url} target="_blank" rel="noreferrer">
            {red.texto}
          </a>
        ))}
      </nav>
    </footer>
  );
}

export default Footer;
