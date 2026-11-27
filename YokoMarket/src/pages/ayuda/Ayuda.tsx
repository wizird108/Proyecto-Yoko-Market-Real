/* =========================================================
   Ayuda.tsx — PÁGINA DE AYUDA (ruta "/ayuda")
   Página NUEVA (no existía en el original): ahí el botón
   "Ayuda" del footer solo mostraba un aviso. La rúbrica pide
   que todos los botones funcionen, así que ahora lleva aquí.
   Usa clases que ya existen en style.css.
   ========================================================= */

import useTitulo from "../../hooks/useTitulo";

/* Preguntas frecuentes. Para agregar una, basta con sumar un objeto. */
const preguntas = [
  {
    pregunta: "What is YokoMarket?",
    respuesta:
      "A marketplace for Álvaro Díaz merch: official products and resale items listed by fellow fans.",
  },
  {
    pregunta: "How do I add a product to my bag?",
    respuesta:
      "Open a product, choose a size when required and add it to your bag. You can adjust quantities or remove items in the bag.",
  },
  {
    pregunta: "How do I sell an item?",
    respuesta:
      "Sign in and select Sell in the footer. Add details, upload photos and publish your item.",
  },
  {
    pregunta: "Is my data saved?",
    respuesta:
      "Accounts, listings, reviews and profiles are stored in Supabase. Your bag and wishlist sync across devices when you sign in. Guest lists stay on this device.",
  },
];

function Ayuda() {
  useTitulo("Help | YokoMarket");

  return (
    <section className="seccion-home">
      <h1 className="titulo-seccion">HELP</h1>
      {/* Una pregunta y su respuesta por cada elemento del arreglo */}
      {preguntas.map((item) => (
        <div key={item.pregunta}>
          <h2 className="nombre-producto">{item.pregunta}</h2>
          <p>{item.respuesta}</p>
        </div>
      ))}
    </section>
  );
}

export default Ayuda;
