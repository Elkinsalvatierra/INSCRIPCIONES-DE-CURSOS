import { Link, useParams } from "react-router-dom";
import TarjetaCurso from "../components/TarjetaCurso.jsx";
import { CATEGORIAS } from "../data/categorias.js";

function Categoria() {
  const { nombre } = useParams();
  const categoria = CATEGORIAS.find((item) => item.nombre === nombre);

  if (!categoria) {
    return (
      <main>
        <p>La categoría solicitada no existe.</p>
        <Link to="/">Volver al inicio</Link>
      </main>
    );
  }

  return (
    <main>
      <Link to="/">Volver a categorías</Link>
      <h1>Cursos de {categoria.nombre}</h1>
      <p>{categoria.descripcion}</p>
      <section aria-label={`Cursos de ${categoria.nombre}`}>
        {categoria.cursos.map((curso) => (
          <TarjetaCurso key={curso.nombre} curso={curso} />
        ))}
      </section>
    </main>
  );
}

export default Categoria;
