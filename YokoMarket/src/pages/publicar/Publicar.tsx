// Entrega final: conserva la interfaz previa y conecta los datos del sistema.

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";

import { type Producto } from "../../data/productos";
import useTitulo from "../../hooks/useTitulo";
import { useAuth } from "../../layout/Auth/Auth";
import { publicarProducto } from "../../services/datosRemotos";

/* Fotos permitidas, igual que el original. */
const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];
const PESO_MAXIMO = 300 * 1024; // 300 KB

/* Valores iniciales del formulario (los primeros de cada select). */
const formularioVacio = {
  nombre: "",
  categoria: "ropa",
  estado: "Used · Like new",
  talla: "",
  genero: "unisex",
  precio: "",
  ubicacion: "",
  descripcion: "",
};

function Publicar() {
  useTitulo("Sell an item | YokoMarket");

  const { user } = useAuth();
  const navigate = useNavigate();

  /* Todos los campos en un solo objeto de estado. */
  const [datos, setDatos] = useState(formularioVacio);

  /* 4 espacios para fotos. null = sin foto. */
  const [fotos, setFotos] = useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [error, setError] = useState("");
  const [archivos, setArchivos] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [enviando, setEnviando] = useState(false);

  /* Un solo manejador para todos los campos: usa el "name" del campo
     para saber qué propiedad cambiar. [nombre]: valor = propiedad dinámica. */
  function cambiarCampo(
    evento: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  /* Elegir una foto. FileReader lee el archivo de la computadora y
     readAsDataURL lo convierte en texto para mostrar la vista previa.
     Al publicar, el File original se sube a Supabase Storage. */
  function elegirFoto(indice: number, evento: ChangeEvent<HTMLInputElement>) {
    const campo = evento.target;
    const archivo = campo.files?.[0];
    setError("");
    ponerFoto(indice, null);
    setArchivos((prev) =>
      prev.map((actual, i) => (i === indice ? null : actual)),
    );
    if (!archivo) return;

    if (!TIPOS_FOTO.includes(archivo.type) || archivo.size > PESO_MAXIMO) {
      setError("Choose a JPG, PNG or WebP file up to 300 KB.");
      campo.value = ""; // vacía el input para que se pueda volver a elegir
      return;
    }

    setArchivos((prev) =>
      prev.map((actual, i) => (i === indice ? archivo : actual)),
    );
    const lector = new FileReader();
    // "load" se activa cuando termina de leer; recién ahí tenemos la foto.
    lector.addEventListener("load", () =>
      ponerFoto(indice, lector.result as string),
    );
    lector.addEventListener("error", () => {
      campo.value = "";
      setError("Unable to read this photo. Please select it again.");
    });
    lector.readAsDataURL(archivo);
  }

  /* Cambia una foto del arreglo sin mutar el estado: "prev" es el
     arreglo más reciente (importante porque FileReader termina después). */
  function ponerFoto(indice: number, foto: string | null) {
    setFotos((prev) => prev.map((actual, i) => (i === indice ? foto : actual)));
  }

  async function publicar(evento: FormEvent) {
    evento.preventDefault();
    if (!user) return;

    if (!fotos[0]) {
      setError("Wait for the cover photo to finish loading.");
      return;
    }
    if (
      !datos.nombre.trim() ||
      !datos.ubicacion.trim() ||
      !datos.descripcion.trim()
    ) {
      setError("Complete every field with valid information.");
      return;
    }

    /* Mismo esquema que los productos oficiales (tipo Producto).
       oficial: false los separa claramente de la tienda oficial. */
    const producto: Producto = {
      id: crypto.randomUUID(),
      nombre: datos.nombre.trim(),
      precio: Number(datos.precio),
      categoria: datos.categoria,
      estado: datos.estado,
      talla: datos.talla,
      tallas: datos.talla ? [datos.talla] : [],
      genero: datos.genero,
      resenas: [],
      oferta: false,
      precioAnterior: null,
      ubicacion: datos.ubicacion.trim(),
      descripcion: datos.descripcion.trim(),
      imagen: fotos[0],
      fotos: fotos.map((foto) => foto ?? ""), // '' = espacio sin foto
      preventa: false,
      oficial: false,
      usuarioId: user.id,
      vendedor: "@" + user.nombre,
    };

    setEnviando(true);
    try {
      await publicarProducto(
        producto,
        archivos.filter((foto): foto is File => foto !== null),
      );
      navigate("/perfil");
    } catch (problema) {
      setError(
        problema instanceof Error
          ? problema.message
          : "Publication failed. Please retry.",
      );
    } finally {
      setEnviando(false);
    }
  }

  /* Recuadro de una foto: muestra la vista previa o el texto "+ FOTO".
     El label abre el selector de archivos del input con el mismo id. */
  function recuadroFoto(
    indice: number,
    clase: string,
    texto: string,
    alt: string,
  ) {
    return (
      <label className={clase} htmlFor={"foto-" + indice}>
        {fotos[indice] ? (
          <img alt={alt} src={fotos[indice]} />
        ) : (
          <span>{texto}</span>
        )}
      </label>
    );
  }

  return (
    <>
      <section className="publicar-intro">
        <h1>SELL AN ITEM</h1>
        <p>Complete the details to share your item with the community.</p>
      </section>

      <form
        className="panel publicar-panel"
        id="form-publicar"
        onSubmit={publicar}
      >
        {/* ---------- FOTOS ---------- */}
        <div className="fotos-publicar">
          <h2>PRODUCT PHOTOS</h2>
          {recuadroFoto(
            0,
            "foto-portada",
            "+ UPLOAD COVER PHOTO",
            "Cover preview",
          )}
          <input
            accept="image/png,image/jpeg,image/webp"
            id="foto-0"
            required
            type="file"
            onChange={(e) => elegirFoto(0, e)}
          />
          <div className="fotos-extra">
            {/* Fotos 1, 2 y 3 (opcionales) */}
            {[1, 2, 3].map((indice) => (
              <div key={indice}>
                {recuadroFoto(
                  indice,
                  "foto-extra",
                  "+ PHOTO",
                  "Additional preview" + indice,
                )}
                <input
                  accept="image/png,image/jpeg,image/webp"
                  id={"foto-" + indice}
                  type="file"
                  onChange={(e) => elegirFoto(indice, e)}
                />
              </div>
            ))}
          </div>
          <p className="nota-local">
            JPG, PNG or WebP, up to 300 KB per photo. Photos are uploaded to
            cloud storage.
          </p>
        </div>

        {/* ---------- DATOS ----------
            Cada campo tiene name (para cambiarCampo) y value (controlado). */}
        <div className="datos-publicar">
          <div className="campos-dobles">
            <div className="campo">
              <label htmlFor="nombre">TITLE</label>
              <input
                id="nombre"
                maxLength={100}
                name="nombre"
                placeholder="e.g. Blue Sayonara hoodie"
                required
                type="text"
                value={datos.nombre}
                onChange={cambiarCampo}
              />
            </div>
            <div className="campo">
              <label htmlFor="categoria">CATEGORY</label>
              <select
                id="categoria"
                name="categoria"
                value={datos.categoria}
                onChange={cambiarCampo}
              >
                <option value="ropa">Clothing</option>
                <option value="peluches">Plushies</option>
                <option value="vinilos">Vinyl</option>
                <option value="bolsos">Bags</option>
                <option value="accesorios">Accessories</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="estado">CONDITION</label>
              <select
                id="estado"
                name="estado"
                value={datos.estado}
                onChange={cambiarCampo}
              >
                <option>Used · Like new</option>
                <option>Used · Good condition</option>
                <option>New</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="talla">SIZE</label>
              <select
                required={datos.categoria === "ropa"}
                id="talla"
                name="talla"
                value={datos.talla}
                onChange={cambiarCampo}
              >
                <option value="">Not applicable</option>
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="genero-publicar">Section</label>
              <select
                id="genero-publicar"
                name="genero"
                value={datos.genero}
                onChange={cambiarCampo}
              >
                <option value="unisex">Unisex</option>
                <option value="hombre">Men</option>
                <option value="mujer">Women</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="precio">PRICE (COP)</label>
              <input
                id="precio"
                max="100000000"
                min="1"
                name="precio"
                placeholder="$ 0 COP"
                required
                step="1"
                type="number"
                value={datos.precio}
                onChange={cambiarCampo}
              />
            </div>
            <div className="campo">
              <label htmlFor="ubicacion">LOCATION</label>
              <input
                id="ubicacion"
                maxLength={100}
                name="ubicacion"
                placeholder="Cali, Valle del Cauca"
                required
                type="text"
                value={datos.ubicacion}
                onChange={cambiarCampo}
              />
            </div>
          </div>

          <div className="campo">
            <label htmlFor="descripcion">DESCRIPTION</label>
            <textarea
              id="descripcion"
              maxLength={1000}
              name="descripcion"
              placeholder="Describe its story, condition and important details…"
              required
              value={datos.descripcion}
              onChange={cambiarCampo}
            />
          </div>

          <label className="confirmacion">
            <input id="confirmacion" required type="checkbox" />I confirm the
            photos and information are accurate.
          </label>

          <button className="boton-principal" type="submit" disabled={enviando}>
            SELL AN ITEM
          </button>
          <p id="error-publicar" role="status">
            {error}
          </p>
        </div>
      </form>
    </>
  );
}

export default Publicar;
