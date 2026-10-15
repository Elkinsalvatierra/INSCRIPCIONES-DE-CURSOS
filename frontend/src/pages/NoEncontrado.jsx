import { Link } from "react-router-dom";

// Se muestra cuando la ruta no existe
function NoEncontrado() {
  return (
    <main className="no-encontrado">
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link to="/" className="boton-volver">Volver al inicio</Link>
    </main>
  );
}

export default NoEncontrado;