import IconoCategoria from "./IconoCategoria.jsx";
import { buscarCategoria } from "../data/categorias.js";

function formatearFecha(fecha) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TarjetaInscripcion({ inscripcion }) {
  const { id, nombre, email, cedula, telefono, descripcion, fecha, categoria, curso } = inscripcion;
  const { color } = buscarCategoria(categoria);

  return (
    <article className={`tarjeta-inscripcion tarjeta-${color}`}>
      <header>
        <IconoCategoria color={color} />
        <span>{categoria}</span>
        <span className="tarjeta-id">#{id}</span>
      </header>
      <h2>{curso}</h2>
      <p>{descripcion}</p>
      <dl>
        <div>
          <dt>Participante</dt>
          <dd>{nombre}</dd>
        </div>
        <div>
          <dt>Correo</dt>
          <dd>{email}</dd>
        </div>
        {cedula && (
          <div>
            <dt>Cédula</dt>
            <dd>{cedula}</dd>
          </div>
        )}
        {telefono && (
          <div>
            <dt>Teléfono</dt>
            <dd>{telefono}</dd>
          </div>
        )}
        <div>
          <dt>Inicio</dt>
          <dd>{formatearFecha(fecha)}</dd>
        </div>
      </dl>
    </article>
  );
}

export default TarjetaInscripcion;