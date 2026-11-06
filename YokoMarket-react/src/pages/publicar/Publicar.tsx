/* =========================================================
   Publicar.tsx — PUBLICAR PRODUCTO (ruta "/publicar", pide sesión)
   Reemplaza a publicar.html + publicar.js del original:
     - Hasta 4 fotos (la primera, de portada, es obligatoria).
     - Datos del producto: título, categoría, estado, talla,
       sección, precio, ubicación y descripción.
     - Se guarda en localStorage ("yoko-publicaciones") con la
       misma forma que los productos oficiales, así aparece en
       el inicio (Reventa), en los catálogos y en la búsqueda.
   ========================================================= */

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

import { leerPublicaciones, type Producto } from '../../data/productos'
import useTitulo from '../../hooks/useTitulo'
import { useAuth } from '../../layout/Auth/Auth'
import { guardarDatos } from '../../utils/almacenamiento'

/* Fotos permitidas, igual que el original. */
const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp']
const PESO_MAXIMO = 300 * 1024 // 300 KB

/* Valores iniciales del formulario (los primeros de cada select). */
const formularioVacio = {
  nombre: '',
  categoria: 'ropa',
  estado: 'Usado · Como nuevo',
  talla: '',
  genero: 'unisex',
  precio: '',
  ubicacion: '',
  descripcion: '',
}

function Publicar() {
  useTitulo('Publicar producto | YokoMarket')

  const { user } = useAuth()
  const navigate = useNavigate()

  /* Todos los campos en un solo objeto de estado. */
  const [datos, setDatos] = useState(formularioVacio)

  /* 4 espacios para fotos. null = sin foto. */
  const [fotos, setFotos] = useState<(string | null)[]>([null, null, null, null])
  const [error, setError] = useState('')

  /* Un solo manejador para todos los campos: usa el "name" del campo
     para saber qué propiedad cambiar. [nombre]: valor = propiedad dinámica. */
  function cambiarCampo(evento: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
  }

  /* Elegir una foto. FileReader lee el archivo de la computadora y
     readAsDataURL lo convierte en texto (data:image/...) para poder
     guardarlo en localStorage. No se sube a ningún servidor. */
  function elegirFoto(indice: number, evento: ChangeEvent<HTMLInputElement>) {
    const campo = evento.target
    const archivo = campo.files?.[0]
    setError('')
    ponerFoto(indice, null)
    if (!archivo) return

    if (!TIPOS_FOTO.includes(archivo.type) || archivo.size > PESO_MAXIMO) {
      setError('Selecciona JPG, PNG o WebP de hasta 300 KB.')
      campo.value = '' // vacía el input para que se pueda volver a elegir
      return
    }

    const lector = new FileReader()
    // "load" se activa cuando termina de leer; recién ahí tenemos la foto.
    lector.addEventListener('load', () => ponerFoto(indice, lector.result as string))
    lector.addEventListener('error', () => {
      campo.value = ''
      setError('No se pudo leer la foto. Selecciónala otra vez.')
    })
    lector.readAsDataURL(archivo)
  }

  /* Cambia una foto del arreglo sin mutar el estado: "prev" es el
     arreglo más reciente (importante porque FileReader termina después). */
  function ponerFoto(indice: number, foto: string | null) {
    setFotos((prev) => prev.map((actual, i) => (i === indice ? foto : actual)))
  }

  function publicar(evento: FormEvent) {
    evento.preventDefault()
    if (!user) return

    if (!fotos[0]) {
      setError('Espera a que termine de cargar la foto de portada.')
      return
    }
    if (!datos.nombre.trim() || !datos.ubicacion.trim() || !datos.descripcion.trim()) {
      setError('Completa los campos con información, no solo espacios.')
      return
    }

    /* Mismo esquema que los productos oficiales (tipo Producto).
       oficial: false los separa claramente de la tienda oficial. */
    const producto: Producto = {
      id: 'fan-' + Date.now(),
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
      fotos: fotos.map((foto) => foto ?? ''), // '' = espacio sin foto
      preventa: false,
      oficial: false,
      usuarioId: user.id,
      vendedor: '@' + user.nombre,
    }

    // Leemos otra vez las publicaciones para no perder ninguna y agregamos la nueva.
    if (guardarDatos('yoko-publicaciones', [...leerPublicaciones(), producto])) {
      navigate('/perfil')
    } else {
      setError('No fue posible guardar. Reduce el tamaño de las fotos o revisa el almacenamiento del navegador.')
    }
  }

  /* Recuadro de una foto: muestra la vista previa o el texto "+ FOTO".
     El label abre el selector de archivos del input con el mismo id. */
  function recuadroFoto(indice: number, clase: string, texto: string, alt: string) {
    return (
      <label className={clase} htmlFor={'foto-' + indice}>
        {fotos[indice] ? <img alt={alt} src={fotos[indice]} /> : <span>{texto}</span>}
      </label>
    )
  }

  return (
    <>
      <section className="publicar-intro">
        <h1>PUBLICAR PRODUCTO</h1>
        <p>Completa la información para compartir tu pieza con la comunidad.</p>
      </section>

      <form className="panel publicar-panel" id="form-publicar" onSubmit={publicar}>
        {/* ---------- FOTOS ---------- */}
        <div className="fotos-publicar">
          <h2>FOTOS DEL PRODUCTO</h2>
          {recuadroFoto(0, 'foto-portada', '+ SUBIR FOTO DE PORTADA', 'Vista previa de portada')}
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
                {recuadroFoto(indice, 'foto-extra', '+ FOTO', 'Vista previa adicional ' + indice)}
                <input
                  accept="image/png,image/jpeg,image/webp"
                  id={'foto-' + indice}
                  type="file"
                  onChange={(e) => elegirFoto(indice, e)}
                />
              </div>
            ))}
          </div>
          <p className="nota-local">JPG, PNG o WebP, máximo 300 KB por foto. Se guardan solo en este navegador.</p>
        </div>

        {/* ---------- DATOS ----------
            Cada campo tiene name (para cambiarCampo) y value (controlado). */}
        <div className="datos-publicar">
          <div className="campos-dobles">
            <div className="campo">
              <label htmlFor="nombre">TÍTULO</label>
              <input
                id="nombre"
                maxLength={100}
                name="nombre"
                placeholder="Ej. Hoodie Sayonara azul"
                required
                type="text"
                value={datos.nombre}
                onChange={cambiarCampo}
              />
            </div>
            <div className="campo">
              <label htmlFor="categoria">CATEGORÍA</label>
              <select id="categoria" name="categoria" value={datos.categoria} onChange={cambiarCampo}>
                <option value="ropa">Ropa</option>
                <option value="peluches">Peluches</option>
                <option value="vinilos">Vinilos</option>
                <option value="bolsos">Bolsos</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="estado">ESTADO</label>
              <select id="estado" name="estado" value={datos.estado} onChange={cambiarCampo}>
                <option>Usado · Como nuevo</option>
                <option>Usado · Buen estado</option>
                <option>Nuevo</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="talla">TALLA</label>
              <select id="talla" name="talla" value={datos.talla} onChange={cambiarCampo}>
                <option value="">No aplica</option>
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="genero-publicar">Sección</label>
              <select id="genero-publicar" name="genero" value={datos.genero} onChange={cambiarCampo}>
                <option value="unisex">Unisex</option>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="precio">PRECIO (COP)</label>
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
              <label htmlFor="ubicacion">UBICACIÓN</label>
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
            <label htmlFor="descripcion">DESCRIPCIÓN</label>
            <textarea
              id="descripcion"
              maxLength={1000}
              name="descripcion"
              placeholder="Cuenta su historia, uso y detalles importantes…"
              required
              value={datos.descripcion}
              onChange={cambiarCampo}
            />
          </div>

          <label className="confirmacion">
            <input id="confirmacion" required type="checkbox" />
            Confirmo que las fotos y la información son reales.
          </label>

          <button className="boton-principal" type="submit">
            PUBLICAR PRODUCTO
          </button>
          <p id="error-publicar" role="status">
            {error}
          </p>
        </div>
      </form>
    </>
  )
}

export default Publicar
