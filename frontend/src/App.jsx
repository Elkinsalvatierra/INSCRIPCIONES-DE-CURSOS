import { Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio.jsx";
import Categoria from "./pages/Categoria.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/categoria/:nombre" element={<Categoria />} />
    </Routes>
  );
}

export default App;
