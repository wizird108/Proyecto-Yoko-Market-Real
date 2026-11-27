// Entrega final: conserva la interfaz previa y conecta los datos del sistema.

import { store } from "../store/store";

/* 1. TIPOS (S6): describen la forma de cada objeto.
   El "?" significa que ese campo es opcional. */
export interface Resena {
  autor: string;
  estrellas: string;
  texto: string;
}

export interface Producto {
  id: number | string; // número en los oficiales; UUID en las publicaciones
  nombre: string;
  precio: number; // en COP
  categoria: string;
  imagen?: string; // si no hay, la tarjeta muestra "Imagen pendiente"
  preventa: boolean;
  oficial: boolean; // true = tienda oficial, false = publicado por un usuario
  oferta: boolean;
  precioAnterior: number | null; // precio sin descuento (solo si hay oferta)
  tallas: string[];
  genero: string;
  estilo?: string; // Etiqueta simulada para practicar filtros, no información comercial.
  estado: string;
  ubicacion: string;
  descripcion: string;
  resenas: Resena[];
  // Solo en publicaciones de usuarios (las crea la página Publicar):
  fotos?: string[]; // varias fotos; el detalle muestra botones "Foto 1, 2, 3"
  talla?: string; // la talla que eligió quien publicó
  vendedor?: string; // "@nombre" de quien publicó
  usuarioId?: string; // id de la cuenta que publicó
}

/* 2. DATOS BASE (precios en USD, como en la tienda oficial). */
const productosBase = [
  {
    id: 1,
    nombre: "Omakase Tracklist Tee",
    precio: 45.0,
    categoria: "ropa",
    preventa: true,
  },
  {
    id: 2,
    nombre: "No Podemos Ser Amigos Baby Tee",
    precio: 40.0,
    categoria: "ropa",
    preventa: true,
  },
  {
    id: 3,
    nombre: "Omakase Black Tote Bag",
    precio: 25.0,
    categoria: "bolsos",
    preventa: true,
  },
  {
    id: 4,
    nombre: "Omakase Bikini Top",
    precio: 32.0,
    categoria: "ropa",
    preventa: true,
  },
  {
    id: 5,
    nombre: "Omakase Logo Bralette",
    precio: 32.0,
    categoria: "ropa",
    preventa: true,
  },
  {
    id: 6,
    nombre: "OMAKASE 2LP Picture Disc Vinyl",
    precio: 39.98,
    categoria: "vinilos",
    preventa: true,
  },
  {
    id: 7,
    nombre: "OMAKASE CD",
    precio: 11.99,
    categoria: "vinilos",
    preventa: true,
  },
  {
    id: 8,
    nombre: "Chef Coco Plushie",
    precio: 45.0,
    categoria: "peluches",
    preventa: false,
  },
  {
    id: 9,
    nombre: "OMAKASE Logo Chef Apron Fan Pack",
    precio: 37.99,
    categoria: "accesorios",
    preventa: true,
  },
  {
    id: 10,
    nombre: "Te Lo Dejo a Ti Black Zip-Up Hoodie Fan Pack",
    precio: 92.99,
    categoria: "ropa",
    preventa: false,
  },
  {
    id: 11,
    nombre: "Te Lo Dejo a Ti Black Zip-Up Hoodie",
    precio: 85.0,
    categoria: "ropa",
    preventa: false,
  },
  {
    id: 12,
    nombre: "OMAKASE Logo Chef Apron",
    precio: 30.0,
    categoria: "accesorios",
    preventa: false,
  },
];

/* Fotos oficiales incluidas en public/images/oficial.
   Usamos rutas estables para que también puedan guardarse en Supabase.
   Los recursos de la interfaz conservan su ubicación en src/assets. */

/* Conversión fija para el ejercicio, NO una tasa de cambio real. */
const CAMBIO_DE_PRUEBA = 4000;

/* Productos en oferta (igual que el original: 1, 8 y 11, con 20% de descuento). */
const IDS_EN_OFERTA = [1, 8, 11];

/* Productos para mujer (el resto son unisex). */
const IDS_MUJER = [2, 4, 5];

/* 3. PRODUCTOS COMPLETOS
   .map() (S3) recorre los datos base y devuelve un arreglo nuevo
   con cada producto convertido a COP y con los datos que faltan. */
export const productos: Producto[] = productosBase.map((base) => {
  const precioCOP = Math.round(base.precio * CAMBIO_DE_PRUEBA);
  const enOferta = IDS_EN_OFERTA.includes(base.id);

  return {
    ...base, // "spread": copia id, nombre, categoria y preventa
    imagen: `/images/oficial/producto-${base.id}.png`,
    oficial: true,
    oferta: enOferta,
    precioAnterior: enOferta ? precioCOP : null,
    precio: enOferta ? Math.round(precioCOP * 0.8) : precioCOP,
    // Datos simulados para practicar filtros y tallas (igual que el original):
    tallas: base.categoria === "ropa" ? ["XS", "S", "M", "L", "XL"] : [],
    genero: IDS_MUJER.includes(base.id) ? "mujer" : "unisex",
    estilo: [10, 11].includes(base.id)
      ? "Oversize"
      : [2, 4, 5].includes(base.id)
        ? "Basics"
        : "Graphics",
    estado: "New",
    ubicacion: "Official store",
    descripcion:
      base.nombre +
      ". From the Álvaro Díaz catalog. " +
      "Check availability and details before buying.",
    resenas: [], // no inventamos opiniones de clientes
  };
});

/* Publicaciones consultadas desde Redux. Supabase las carga al iniciar
   y vuelve a consultarlas cuando recibe un evento de Realtime. */
export function leerPublicaciones(): Producto[] {
  return store
    .getState()
    .catalogo.publicaciones.filter((producto) => !producto.oficial);
}

/* 5. TODOS LOS PRODUCTOS (oficiales + publicaciones)
   Igual que PRODUCTOS del original: una sola lista para buscar.
   [...a, ...b] crea un arreglo nuevo con los elementos de ambos. */
export function todosLosProductos(): Producto[] {
  const catalogo = store.getState().catalogo;
  // Conectado: la base es la fuente de verdad, incluso si queda vacía.
  // Sin conexión inicial: los datos anteriores permiten revisar el diseño.
  return catalogo.cargado ? catalogo.publicaciones : productos;
}

/* 6. BUSCAR UN PRODUCTO POR SU ID
   .find() (S3) devuelve el primer producto que cumple la condición,
   o undefined si no hay ninguno. Usamos String() porque el id de la
   URL ("3") es texto y el de los datos (3) es número. */
export function buscarProducto(id: number | string): Producto | undefined {
  return todosLosProductos().find(
    (producto) => String(producto.id) === String(id),
  );
}

/* 7. CONFIGURACIÓN DE CADA CATÁLOGO (igual que CATALOGOS del original)
   Record<string, ...> (S6) es un objeto cuyas claves son textos
   ("ropa", "peluches"...) y cuyos valores tienen esta forma. */
export const CATALOGOS: Record<
  string,
  { titulo: string; subtitulo: string; color: string }
> = {
  ropa: {
    titulo: "CLOTHING",
    subtitulo: "Oversize, graphics and basics",
    color: "#2266c9",
  },
  peluches: {
    titulo: "PLUSHIES",
    subtitulo: "Coco and friends from Felicilandia",
    color: "#e85d75",
  },
  sale: {
    titulo: "SALE",
    subtitulo: "Last items, happy prices",
    color: "#e5372b",
  },
  vinilos: { titulo: "VINYL", subtitulo: "", color: "#2266c9" },
  // accesorios era azul en el original; ahora dorado, el color de su banner
  accesorios: { titulo: "ACCESSORIES", subtitulo: "", color: "#b37d00" },
};
