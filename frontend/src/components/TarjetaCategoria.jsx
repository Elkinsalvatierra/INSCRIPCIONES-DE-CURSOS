import { Link } from "react-router-dom";
import IconoCategoria from "./IconoCategoria.jsx";

function TarjetaCategoria({ categoria }) {
  return (
    <Link to={`/categoria/${categoria.nombre}`} className={`tarjeta-categoria tarjeta-${categoria.color}`}>
      <IconoCategoria color={categoria.color} />
      <h2>{categoria.nombre}</h2>
      <p>{categoria.descripcion}</p>
      <span>{categoria.cursos.length} cursos</span>
    </Link>
  );
}

export default TarjetaCategoria;
