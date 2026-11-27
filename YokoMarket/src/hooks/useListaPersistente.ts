// Conserva la API sencilla de los contextos y sincroniza las listas por usuario.
import { useEffect, useState } from "react";
import { useAuth } from "../layout/Auth/Auth";
import { guardarDatos, leerDatos } from "../utils/almacenamiento";
import { api, supabase } from "../services/supabase";

type Fila<T> = { datos: T[] };
export default function useListaPersistente<T>(tipo: "favoritos" | "carrito") {
  const { user } = useAuth();
  const usuarioId = user?.id;
  const clave = `yoko-${tipo}-${usuarioId || "guest"}`;
  const [estado, setEstado] = useState(() => ({
    clave,
    lista: leerDatos<T[]>(clave, []),
    remota: false,
  }));
  const lista =
    estado.clave === clave ? estado.lista : leerDatos<T[]>(clave, []);
  const [error, setError] = useState("");
  const [pendiente, setPendiente] = useState(false);
  useEffect(() => {
    if (!usuarioId || !supabase) return;
    let activo = true;
    async function cargar() {
      try {
        const { data } = await api.get<Fila<T>[]>(
          `/listas?usuario_id=eq.${usuarioId}&tipo=eq.${tipo}&select=datos`,
        );
        if (activo) {
          const datos = data[0]?.datos || [];
          guardarDatos(clave, datos);
          setEstado({ clave, lista: datos, remota: true });
          setError("");
        }
      } catch {
        if (activo)
          setError(
            "Could not sync your saved list. Please reload before editing it.",
          );
      }
    }
    void cargar();
    const canal = supabase
      .channel(`lista-${tipo}-${usuarioId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "listas",
          filter: `usuario_id=eq.${usuarioId}`,
        },
        () => {
          void cargar();
        },
      )
      .subscribe();
    return () => {
      activo = false;
      void supabase?.removeChannel(canal);
    };
  }, [usuarioId, tipo, clave]);

  async function guardar(nueva: T[]) {
    if (pendiente || (user && (estado.clave !== clave || !estado.remota)))
      return;
    setPendiente(true);
    setError("");
    try {
      if (user) {
        // Una fila por usuario y tipo. RLS impide acceder a listas de otra cuenta.
        await api.post(
          "/listas?on_conflict=usuario_id,tipo",
          {
            usuario_id: user.id,
            tipo,
            datos: nueva,
          },
          { headers: { Prefer: "resolution=merge-duplicates" } },
        );
      }
      if (!guardarDatos(clave, nueva) && !user)
        throw new Error("Local storage is full.");
      setEstado({ clave, lista: nueva, remota: Boolean(user) });
    } catch {
      setError(
        "Could not save your list. Check your connection and try again.",
      );
    } finally {
      setPendiente(false);
    }
  }
  return {
    lista,
    guardar,
    error,
    pendiente:
      pendiente || Boolean(user && (estado.clave !== clave || !estado.remota)),
  };
}
