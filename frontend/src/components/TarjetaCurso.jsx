import { createSearchParams, Link } from "react-router-dom";

function TarjetaCurso({ curso, categoria }) {
  const parametros = createSearchParams({
    categoria: categoria.nombre,
    curso: curso.nombre,
  });

  return (
    <article className="tarjeta-curso">
      <img src={curso.imagen} alt="" />
      <div>
        <h2>{curso.nombre}</h2>
        <p>{curso.descripcion}</p>
        <Link to={`/registro?${parametros.toString()}`}>Inscribirme</Link>
      </div>
    </article>
  );
}

export default TarjetaCurso;
