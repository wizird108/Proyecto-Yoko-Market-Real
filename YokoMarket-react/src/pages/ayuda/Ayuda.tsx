/* =========================================================
   Ayuda.tsx — PÁGINA DE AYUDA (ruta "/ayuda")
   Página NUEVA (no existía en el original): ahí el botón
   "Ayuda" del footer solo mostraba un aviso. La rúbrica pide
   que todos los botones funcionen, así que ahora lleva aquí.
   Usa clases que ya existen en style.css.
   ========================================================= */

import useTitulo from '../../hooks/useTitulo'

/* Preguntas frecuentes. Para agregar una, basta con sumar un objeto. */
const preguntas = [
  {
    pregunta: '¿Qué es YokoMarket?',
    respuesta:
      'Un marketplace de merch de Álvaro Díaz: productos de la tienda oficial y artículos que publican otros fans (reventa).',
  },
  {
    pregunta: '¿Cómo compro un producto?',
    respuesta:
      'Abre el producto, elige la talla si la tiene y agrégalo a la bolsa. Desde la bolsa puedes cambiar cantidades o eliminarlo.',
  },
  {
    pregunta: '¿Cómo vendo algo?',
    respuesta: 'Inicia sesión y entra a "Vender" en el pie de página. Completa los datos, sube las fotos y publica.',
  },
  {
    pregunta: '¿Mis datos se guardan?',
    respuesta:
      'Es un prototipo: la cuenta, la bolsa, los favoritos y las publicaciones se guardan solo en este navegador.',
  },
]

function Ayuda() {
  useTitulo('Ayuda | YokoMarket')

  return (
    <section className="seccion-home">
      <h1 className="titulo-seccion">AYUDA</h1>
      {/* Una pregunta y su respuesta por cada elemento del arreglo */}
      {preguntas.map((item) => (
        <div key={item.pregunta}>
          <h2 className="nombre-producto">{item.pregunta}</h2>
          <p>{item.respuesta}</p>
        </div>
      ))}
    </section>
  )
}

export default Ayuda
