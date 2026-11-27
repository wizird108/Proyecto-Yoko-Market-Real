import { api, exigirConexion } from "./supabase";
import type { Producto, Resena } from "../data/productos";
import {
  recibirComentarios,
  recibirPublicaciones,
  store,
  type Comentario,
} from "../store/store";

export async function cargarCatalogo() {
  const [productos, comentarios] = await Promise.all([
    api.get<{ datos: Producto }[]>(
      "/productos?select=datos&order=created_at.desc",
    ),
    api.get<Comentario[]>("/comentarios?select=*&order=created_at.asc"),
  ]);
  store.dispatch(
    recibirPublicaciones(productos.data.map((fila) => fila.datos)),
  );
  store.dispatch(recibirComentarios(comentarios.data));
}

// Las imágenes pasan a Storage. En la base de datos guardamos sus URL públicas.
export async function publicarProducto(producto: Producto, fotos: File[]) {
  const cliente = exigirConexion();
  const { data, error } = await cliente.auth.getUser();
  if (error || !data.user) throw new Error("Sign in before publishing.");
  const subidas: string[] = [];
  const urls: string[] = [];
  try {
    for (const foto of fotos) {
      const extension =
        foto.type === "image/png"
          ? "png"
          : foto.type === "image/webp"
            ? "webp"
            : "jpg";
      const ruta = `${data.user.id}/${crypto.randomUUID()}.${extension}`;
      const resultado = await cliente.storage
        .from("productos")
        .upload(ruta, foto);
      if (resultado.error) throw resultado.error;
      subidas.push(ruta);
      urls.push(
        cliente.storage.from("productos").getPublicUrl(ruta).data.publicUrl,
      );
    }
    const definitivo = {
      ...producto,
      usuarioId: data.user.id,
      imagen: urls[0],
      fotos: urls,
    };
    await api.post("/productos", {
      id: String(producto.id),
      usuario_id: data.user.id,
      datos: definitivo,
    });
    store.dispatch(
      recibirPublicaciones([
        definitivo,
        ...store.getState().catalogo.publicaciones,
      ]),
    );
  } catch (error) {
    // Si falla la publicación, no dejamos imágenes huérfanas.
    if (subidas.length) await cliente.storage.from("productos").remove(subidas);
    throw error;
  }
}

export async function publicarComentario(
  productoId: string | number,
  resena: Resena,
) {
  const cliente = exigirConexion();
  const { data } = await cliente.auth.getUser();
  if (!data.user) throw new Error("Sign in before reviewing.");
  const respuesta = await api.post<Comentario[]>(
    "/comentarios",
    {
      producto_id: String(productoId),
      usuario_id: data.user.id,
      autor: resena.autor,
      estrellas: resena.estrellas,
      texto: resena.texto,
    },
    { headers: { Prefer: "return=representation" } },
  );
  const actuales = store.getState().catalogo.comentarios;
  const nuevos = respuesta.data.filter(
    (nuevo) => !actuales.some((actual) => actual.id === nuevo.id),
  );
  store.dispatch(recibirComentarios([...actuales, ...nuevos]));
}
