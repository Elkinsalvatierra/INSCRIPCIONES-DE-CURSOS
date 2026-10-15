import { Link, NavLink } from "react-router-dom";

// NavLink agrega la clase "activo" al enlace de la página actual
function Menu() {
  const claseEnlace = ({ isActive }) => (isActive ? "enlace activo" : "enlace");

  return (
    <header className="menu">
      <Link to="/" className="marca">
        Inscripciones
      </Link>
      <nav className="menu-enlaces" aria-label="Menú principal">
        <NavLink to="/" end className={claseEnlace}>
          Inicio
        </NavLink>
        <NavLink to="/lista" className={claseEnlace}>
          Inscritos
        </NavLink>
        <NavLink to="/registro" className={claseEnlace}>
          Inscribirme
        </NavLink>
      </nav>
    </header>
  );
}

export default Menu;