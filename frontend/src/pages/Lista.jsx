import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TarjetaInscripcion from "../components/TarjetaInscripcion.jsx";
import FiltroCategorias from "../components/FiltroCategorias.jsx";
import Mensaje from "../components/Mensaje.jsx";
import { obtenerInscripciones } from "../services/api.js";

function Lista() {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [parametros, setParametros] = useSearchParams();
  const categoria = parametros.get("categoria") || "";

  async function cargar() {
    setCargando(true);
    setError("");

    try {
      setInscripciones(await obtenerInscripciones());
    } catch {
      setError("No se pudo conectar con el servidor. Verifica que el backend esté encendido.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function cambiarCategoria(nueva) {
    setParametros(nueva ? { categoria: nueva } : {});
  }

  const visibles = categoria
    ? inscripciones.filter((inscripcion) => inscripcion.categoria === categoria)
    : inscripciones;

  return (
    <main>
      <h1>Inscripciones registradas</h1>
      <p>
        {cargando || error
          ? "Consulta las inscripciones guardadas en el servidor."
          : `${visibles.length} de ${inscripciones.length} inscripciones`}
      </p>

      <div className="acciones">
        <button type="button" onClick={cargar} disabled={cargando}>
          Actualizar
        </button>
        <Link to="/registro">Nueva inscripción</Link>
      </div>

      <FiltroCategorias seleccionada={categoria} onCambiar={cambiarCategoria} />

      {cargando && <Mensaje tipo="carga">Cargando inscripciones...</Mensaje>}
      {!cargando && error && <Mensaje tipo="error">{error}</Mensaje>}
      {!cargando && !error && inscripciones.length === 0 && (
        <Mensaje>
          Todavía no hay inscripciones. <Link to="/registro">Registra la primera</Link>.
        </Mensaje>
      )}
      {!cargando && !error && inscripciones.length > 0 && visibles.length === 0 && (
        <Mensaje>No hay inscripciones en la categoría {categoria}.</Mensaje>
      )}

      {!cargando && !error && visibles.length > 0 && (
        <section className="grilla" aria-label="Lista de inscripciones">
          {visibles.map((inscripcion) => (
            <TarjetaInscripcion key={inscripcion.id} inscripcion={inscripcion} />
          ))}
        </section>
      )}
    </main>
  );
}

export default Lista;