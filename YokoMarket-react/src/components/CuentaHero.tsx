/* =========================================================
   CuentaHero.tsx — COLUMNA AZUL DE LOGIN Y REGISTRO
   En el original, login.html y registro.html repetían este
   mismo bloque. Aquí se escribe una vez y lo usan las dos
   páginas. Estilos en sistema.css (.cuenta-hero).
   ========================================================= */

function CuentaHero() {
  return (
    <aside aria-label="Comunidad YokoMarket" className="cuenta-hero">
      <p className="logo">YOKOMARKET</p>
      <h2>
        TU COLECCIÓN
        <br />
        EMPIEZA AQUÍ
      </h2>
      <p>Compra, vende y conecta con otros fans.</p>
    </aside>
  )
}

export default CuentaHero
