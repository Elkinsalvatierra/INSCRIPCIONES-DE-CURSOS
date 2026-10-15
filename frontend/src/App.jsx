import { Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio.jsx";
import Categoria from "./pages/Categoria.jsx";
import Registro from "./pages/Registro.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/categoria/:nombre" element={<Categoria />} />
      <Route path="/registro" element={<Registro />} />
    </Routes>
  );
}

export default App;
