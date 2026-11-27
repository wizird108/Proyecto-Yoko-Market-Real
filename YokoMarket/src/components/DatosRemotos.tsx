import { useEffect, useState, type ReactNode } from "react";
import { cargarCatalogo } from "../services/datosRemotos";
import { configurado, supabase } from "../services/supabase";

// Carga inicial y suscripción: un cambio de otro usuario actualiza Redux.
export default function DatosRemotos({ children }: { children: ReactNode }) {
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(configurado);
  useEffect(() => {
    if (!supabase) return;
    let activo = true;
    async function actualizar() {
      try {
        await cargarCatalogo();
        if (activo) setError("");
      } catch {
        if (activo)
          setError(
            "Connection failed. Check Supabase configuration and reload.",
          );
      } finally {
        if (activo) setCargando(false);
      }
    }
    void actualizar();
    const canal = supabase
      .channel("catalogo-publico")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "productos" },
        () => {
          void actualizar();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "comentarios" },
        () => {
          void actualizar();
        },
      )
      .subscribe();
    return () => {
      activo = false;
      void supabase?.removeChannel(canal);
    };
  }, []);
  return (
    <>
      {!configurado && (
        <p className="aviso-conexion" role="status">
          Preview mode. Connect Supabase to register, publish and sync data.
        </p>
      )}
      {error && (
        <p className="aviso-conexion" role="alert">
          {error}
        </p>
      )}
      {cargando ? (
        <p className="estado-vacio" role="status">
          Loading catalog…
        </p>
      ) : (
        children
      )}
    </>
  );
}
