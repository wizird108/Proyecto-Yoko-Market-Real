/* =========================================================
   CuentaHero.tsx — COLUMNA AZUL DE LOGIN Y REGISTRO
   En el original, login.html y registro.html repetían este
   mismo bloque. Aquí se escribe una vez y lo usan las dos
   páginas. Estilos en sistema.css (.cuenta-hero).
   ========================================================= */

function CuentaHero() {
  return (
    <aside aria-label="YokoMarket community" className="cuenta-hero">
      <p className="logo">YOKOMARKET</p>
      <h2>
        YOUR COLLECTION
        <br />
        START HERE
      </h2>
      <p>Buy, sell and connect with fellow fans.</p>
    </aside>
  );
}

export default CuentaHero;
