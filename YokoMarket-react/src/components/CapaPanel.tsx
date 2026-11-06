/* =========================================================
   CapaPanel.tsx — CAPA QUE CUBRE LA PÁGINA PARA UN PANEL
   La usan los dos paneles: búsqueda y bolsa. Reemplaza a la
   parte común de paneles.js del original:
     - Fondo oscuro sobre la página; clic afuera = cerrar.
     - Al abrir, el foco pasa al primer control del panel; al
       cerrar, vuelve al botón que lo abrió.
     - Escape cierra; Tab da vueltas solo dentro del panel.
     - El fondo no se desplaza mientras está abierto.
   El panel en sí (su contenido) llega como "children".
   ========================================================= */

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react'

interface CapaPanelProps {
  abierto: boolean
  onCerrar: () => void
  clase?: string // clase extra de la capa ("modo-busqueda" en la búsqueda)
  children: ReactNode // el panel que va encima
}

function CapaPanel({ abierto, onCerrar, clase, children }: CapaPanelProps) {
  /* useRef: referencia al div de la capa para buscar sus botones e inputs. */
  const refCapa = useRef<HTMLDivElement>(null)

  /* Controles del panel a los que se puede llegar con el teclado. */
  function controles() {
    return refCapa.current?.querySelectorAll<HTMLElement>('input, button:not([disabled]), a[href]') ?? []
  }

  /* useEffect (S9): al abrir preparamos todo; el return lo deshace al cerrar. */
  useEffect(() => {
    if (!abierto) return

    const focoAnterior = document.activeElement as HTMLElement | null // botón que abrió el panel
    controles()[0]?.focus() // primer input o botón del panel (igual que el original)
    document.body.classList.add('panel-abierto') // ajustes.css: el fondo no se desplaza

    return () => {
      document.body.classList.remove('panel-abierto')
      focoAnterior?.focus()
    }
  }, [abierto])

  /* Teclado: Escape cierra; Tab no se sale del panel. */
  function manejarTecla(evento: KeyboardEvent) {
    if (evento.key === 'Escape') onCerrar()
    if (evento.key === 'Tab') {
      const lista = controles()
      const primero = lista[0]
      const ultimo = lista[lista.length - 1]
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primero.focus()
      }
    }
  }

  return (
    <div
      ref={refCapa}
      className={clase ? 'capa-panel ' + clase : 'capa-panel'}
      hidden={!abierto}
      onKeyDown={manejarTecla}
      // Si el clic cae en la capa (y no dentro del panel), se cierra.
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar()
      }}
    >
      {children}
    </div>
  )
}

export default CapaPanel
