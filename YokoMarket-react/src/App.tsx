/* =========================================================
   App.tsx — COMPONENTE PRINCIPAL
   Por ahora es una VISTA DE PRUEBA: muestra el Header y una
   tarjeta de producto para comprobar que las fuentes, los
   colores y los estilos originales cargan bien.

   En el commit 2 este archivo se reemplaza por el router,
   que decide qué página mostrar según la URL.
   ========================================================= */

import Header from './components/Header'
import ProductCard from './components/ProductCard'

function App() {
  return (
    // <> </> es un "fragmento": agrupa varios elementos sin
    // agregar una etiqueta extra al HTML.
    <>
      <Header />

      {/* El style de aquí es solo para que la tarjeta de prueba
          no ocupe todo el ancho. Desaparece en el commit 2. */}
      <main style={{ padding: '40px 80px', maxWidth: 320 }}>
        <ProductCard
          producto={{
            id: 1,
            nombre: 'Omakase Tracklist Tee',
            precio: 45000,
            oficial: true,
            preventa: true,
          }}
        />
      </main>
    </>
  )
}

export default App
