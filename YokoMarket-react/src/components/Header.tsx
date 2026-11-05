import { useState, type ReactNode } from 'react'

/* HEADER DE YOKOMARKET
   Migrado de componentes.js (cargarHeader) + style.css + ajustes.css.
   Mismas clases, textos, medidas y puntos de corte que el original. */

const enlaces = [
  { texto: 'INICIO', href: '/' },
  { texto: 'ROPA', href: '/ropa' },
  { texto: 'PELUCHES', href: '/peluches' },
  { texto: 'VINILOS', href: '/vinilos' },
  { texto: 'ACCESORIOS', href: '/accesorios' },
  { texto: 'SALE', href: '/sale', clase: 'enlace-sale' },
]

type Accion = 'buscar' | 'carrito' | 'perfil'

interface HeaderProps {
  /* Opcional: cuando armes los paneles, aquí avisas qué botón se pulsó. */
  onAccion?: (accion: Accion) => void
}

/* Los íconos son los mismos SVG de src/assets/icons, incrustados para no
   tener que copiar archivos todavía. */
const iconos: Record<Accion, ReactNode> = {
  buscar: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.35051 11.1495 3 8.25 3C5.35051 3 3 5.35051 3 8.25C3 11.1495 5.35051 13.5 8.25 13.5Z" stroke="#211D1A" strokeWidth="1.5" />
      <path d="M12.375 12.375L15.375 15.375" stroke="#211D1A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  carrito: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3.75 6H14.25L15 15.75H3L3.75 6Z" stroke="#211D1A" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6.75 6.75V4.5C6.75 3.90326 6.98705 3.33097 7.40901 2.90901C7.83097 2.48705 8.40326 2.25 9 2.25C9.59674 2.25 10.169 2.48705 10.591 2.90901C11.0129 3.33097 11.25 3.90326 11.25 4.5V6.75" stroke="#211D1A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  perfil: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9Z" stroke="#211D1A" strokeWidth="1.5" />
      <path d="M3.375 15.75C3.375 14.2582 3.96763 12.8274 5.02252 11.7725C6.07742 10.7176 7.50816 10.125 9 10.125C10.4918 10.125 11.9226 10.7176 12.9775 11.7725C14.0324 12.8274 14.625 14.2582 14.625 15.75" stroke="#211D1A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

const acciones: { id: Accion; etiqueta: string; texto: string }[] = [
  { id: 'buscar', etiqueta: 'Buscar', texto: 'BUSCAR' },
  { id: 'carrito', etiqueta: 'Carrito', texto: 'CARRITO' },
  { id: 'perfil', etiqueta: 'Perfil', texto: 'PERFIL' },
]

function Header({ onAccion }: HeaderProps) {
  /* Reemplaza a interacciones.js: abre/cierra el menú en pantallas pequeñas. */
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="encabezado">
      <a className="logo" href="/">
        YOKOMARKET
      </a>

      <button
        aria-controls="navegacion"
        aria-expanded={menuAbierto}
        aria-label="Abrir menú"
        className="boton-menu"
        id="boton-menu"
        type="button"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰
      </button>

      <nav
        aria-label="Navegación principal"
        className={`navegacion${menuAbierto ? ' abierta' : ''}`}
        id="navegacion"
      >
        {enlaces.map((enlace) => (
          <a key={enlace.texto} className={enlace.clase} href={enlace.href}>
            {enlace.texto}
          </a>
        ))}
      </nav>

      <div className="acciones-header">
        {acciones.map((accion) => (
          <button
            key={accion.id}
            aria-label={accion.etiqueta}
            data-accion={accion.id}
            type="button"
            onClick={() => onAccion?.(accion.id)}
          >
            {iconos[accion.id]}
            <span className="accion-texto">{accion.texto}</span>
          </button>
        ))}
      </div>
    </header>
  )
}

export default Header
