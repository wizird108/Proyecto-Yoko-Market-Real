/* =========================================================
   Header.tsx — ENCABEZADO DE TODAS LAS PÁGINAS
   Reemplaza a cargarHeader() de componentes.js y al menú
   móvil de main.js del proyecto original.
   Usa las mismas clases, así que se ve igual (style.css).
   ========================================================= */

import { useState } from 'react'
import { Link } from 'react-router'

// Íconos originales. Al importarlos, Vite nos da la ruta correcta del archivo.
import iconoBuscar from '../assets/icons/buscar.svg'
import iconoCarrito from '../assets/icons/carrito.svg'
import iconoPerfil from '../assets/icons/perfil.svg'

/* Lista de enlaces del menú. Con .map() (más abajo) se crea un <Link>
   por cada uno, en vez de escribir seis enlaces casi iguales. */
const enlaces = [
  { texto: 'INICIO', ruta: '/' },
  { texto: 'ROPA', ruta: '/ropa' },
  { texto: 'PELUCHES', ruta: '/peluches' },
  { texto: 'VINILOS', ruta: '/vinilos' },
  { texto: 'ACCESORIOS', ruta: '/accesorios' },
  { texto: 'SALE', ruta: '/sale', clase: 'enlace-sale' }, // SALE va en rojo
]

/* Botones de la derecha. "accion" le dice al layout qué hacer al pulsar. */
const acciones = [
  { accion: 'buscar', texto: 'BUSCAR', etiqueta: 'Buscar', icono: iconoBuscar },
  { accion: 'carrito', texto: 'CARRITO', etiqueta: 'Carrito', icono: iconoCarrito },
  { accion: 'perfil', texto: 'PERFIL', etiqueta: 'Perfil', icono: iconoPerfil },
]

/* Props: datos que el componente padre (el layout Main) le pasa al Header.
   onAccion es una función: el Header avisa qué botón se pulsó y el layout
   decide qué hacer (ir a otra página, mostrar un mensaje...). */
interface HeaderProps {
  onAccion: (accion: string) => void
}

function Header({ onAccion }: HeaderProps) {
  /* Estado del menú móvil: false = cerrado, true = abierto.
     Cuando cambia, React vuelve a dibujar el Header con el nuevo valor. */
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <header className="encabezado">
      {/* Link cambia de página sin recargar (React Router, S10). */}
      <Link className="logo" to="/">
        YOKOMARKET
      </Link>

      {/* Botón ☰ del menú en celular. Igual que el original:
          muestra × cuando el menú está abierto. */}
      <button
        aria-controls="navegacion"
        aria-expanded={menuAbierto}
        aria-label="Abrir menú"
        className="boton-menu"
        id="boton-menu"
        type="button"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        {menuAbierto ? '×' : '☰'}
      </button>

      {/* Si el menú está abierto se agrega la clase "abierta",
          que en el CSS lo hace visible en pantallas pequeñas. */}
      <nav
        aria-label="Navegación principal"
        className={menuAbierto ? 'navegacion abierta' : 'navegacion'}
        id="navegacion"
      >
        {enlaces.map((enlace) => (
          <Link
            key={enlace.ruta} // key: React la necesita en listas para identificar cada elemento
            className={enlace.clase}
            to={enlace.ruta}
            // En el original cada enlace cargaba una página nueva y el menú
            // se cerraba solo. Aquí no se recarga, así que lo cerramos nosotros.
            onClick={() => setMenuAbierto(false)}
          >
            {enlace.texto}
          </Link>
        ))}
      </nav>

      <div className="acciones-header">
        {acciones.map((boton) => (
          <button
            key={boton.accion}
            aria-label={boton.etiqueta}
            type="button"
            onClick={() => onAccion(boton.accion)}
          >
            <img alt="" height={18} src={boton.icono} width={18} />
            <span className="accion-texto">{boton.texto}</span>
          </button>
        ))}
      </div>
    </header>
  )
}

export default Header
