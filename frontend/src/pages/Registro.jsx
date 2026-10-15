import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FormularioInscripcion from "../components/FormularioInscripcion.jsx";
import "./Registro.css";
import { CATEGORIAS } from "../data/categorias.js";
import { crearInscripcion } from "../services/api.js";

function Registro() {
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [parametros] = useSearchParams();
  const categoria = CATEGORIAS.find((item) => item.nombre === parametros.get("categoria"));
  const curso = categoria?.cursos.find((item) => item.nombre === parametros.get("curso"));
  const valoresIniciales = {
    categoria: categoria?.nombre || "",
    curso: curso?.nombre || "",
  };

  async function registrar(inscripcion) {
    setEnviando(true);
    setMensaje(null);

    try {
      await crearInscripcion(inscripcion);
      setMensaje({
        tipo: "exito",
        texto: "¡Inscripción completada con éxito!",
      });
      return true;
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto: error instanceof Error ? error.message : "No se pudo registrar la inscripción.",
      });
      return false;
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <Link
        to={categoria ? `/categoria/${encodeURIComponent(categoria.nombre)}` : "/"}
        className="boton-volver"
      >
        Volver al catálogo
      </Link>
      <h1>Nueva inscripción</h1>
      <p>Completa tus datos para inscribirte en un curso.</p>

      {mensaje && (
        <p className={`mensaje-inscripcion mensaje-inscripcion-${mensaje.tipo}`} role={mensaje.tipo === "error" ? "alert" : "status"}>
          {mensaje.texto}
        </p>
      )}

      <FormularioInscripcion
        key={`${valoresIniciales.categoria}-${valoresIniciales.curso}`}
        valoresIniciales={valoresIniciales}
        onEnviar={registrar}
        enviando={enviando}
      />
    </main>
  );
}

export default Registro;
