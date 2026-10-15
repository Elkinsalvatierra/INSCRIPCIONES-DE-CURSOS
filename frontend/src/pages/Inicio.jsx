import TarjetaCategoria from "../components/TarjetaCategoria.jsx";
import { CATEGORIAS } from "../data/categorias.js";

function Inicio() {
  return (
    <main>
      <h1>Inicio, categorías y catálogo de cursos</h1>
      <p>Explora nuestras categorías y encuentra el curso que deseas realizar.</p>
      <section aria-label="Categorías de cursos">
        {CATEGORIAS.map((categoria) => (
          <TarjetaCategoria key={categoria.nombre} categoria={categoria} />
        ))}
      </section>
    </main>
  );
}

export default Inicio;
