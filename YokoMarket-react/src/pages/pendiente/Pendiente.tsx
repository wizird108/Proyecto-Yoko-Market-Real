/* =========================================================
   Pendiente.tsx — PÁGINA TEMPORAL
   Se muestra en las rutas cuya página todavía no hemos hecho.
   Cada commit siguiente reemplaza una de estas rutas por su
   página real. Cuando todas estén hechas, este archivo se borra.
   ========================================================= */

/* Props: el router le pasa el nombre de la página que falta. */
interface PendienteProps {
  nombre: string
}

function Pendiente({ nombre }: PendienteProps) {
  return (
    <section className="seccion-home">
      <h2 className="titulo-seccion">{nombre}</h2>
      <p>Esta página se construye en un próximo commit.</p>
    </section>
  )
}

export default Pendiente
