import { cloneElement, useState } from "react";
import { CATEGORIAS } from "../data/categorias.js";
import "./FormularioInscripcion.css";

const VALORES_INICIALES = {
  nombre: "",
  email: "",
  cedula: "",
  telefono: "",
  fecha: "",
  categoria: "",
  curso: "",
};

function hoy() {
  const fecha = new Date();
  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
  return fecha.toISOString().slice(0, 10);
}
const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+( [A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/;
function cedulaValida(cedula) {
  if (!/^\d{10}$/.test(cedula)) return false;

  const provincia = Number(cedula.slice(0, 2));
  if (provincia < 1 || provincia > 24 || Number(cedula[2]) > 5) return false;

  let suma = 0;
  for (let indice = 0; indice < 9; indice++) {
    let valor = Number(cedula[indice]) * (indice % 2 === 0 ? 2 : 1);
    if (valor > 9) valor -= 9;
    suma += valor;
  }

  return (10 - (suma % 10)) % 10 === Number(cedula[9]);
}

function validar(valores) {
  const errores = {};

  const nombre = valores.nombre.trim();

  if (!nombre) {
    errores.nombre = "El nombre es obligatorio.";
  } else if (!SOLO_LETRAS.test(nombre)) {
    errores.nombre = "El nombre solo puede tener letras y espacios.";
  } else if (nombre.length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 letras.";
  }

  if (!valores.email.trim()) {
    errores.email = "El correo es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email.trim())) {
    errores.email = "Escribe un correo electrónico válido.";
  }

  if (!valores.cedula) {
    errores.cedula = "La cédula es obligatoria.";
  } else if (!cedulaValida(valores.cedula)) {
    errores.cedula = "Escribe una cédula ecuatoriana válida de 10 dígitos.";
  }

  if (!valores.telefono) {
    errores.telefono = "El teléfono es obligatorio.";
  } else if (!/^0\d{8,9}$/.test(valores.telefono)) {
    errores.telefono = "Debe tener 9 o 10 dígitos y empezar con 0.";
  }

  if (!valores.fecha) {
    errores.fecha = "La fecha es obligatoria.";
  } else if (valores.fecha < hoy()) {
    errores.fecha = "La fecha no puede ser anterior a hoy.";
  }

  if (!valores.categoria) {
    errores.categoria = "Selecciona una categoría.";
  }

  if (!valores.curso) {
    errores.curso = "Selecciona un curso.";
  }

  return errores;
}

function FormularioInscripcion({ valoresIniciales, onEnviar, enviando }) {
  const [valores, setValores] = useState(() => ({
    ...VALORES_INICIALES,
    ...valoresIniciales,
  }));
  const [errores, setErrores] = useState({});
   const categoria = CATEGORIAS.find((item) => item.nombre === valores.categoria);
   const curso = categoria?.cursos.find((item) => item.nombre === valores.curso);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    let valor = value;

    if (name === "cedula" || name === "telefono") {
      valor = value.replace(/\D/g, "");
    }

    // En el nombre se eliminan números y símbolos mientras se escribe
    if (name === "nombre") {
      valor = value
        .replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü ]/g, "")
        .replace(/ {2,}/g, " ")
        .replace(/^ /, "");
    }

    setValores((actuales) => ({
      ...actuales,
      [name]: valor,
      ...(name === "categoria" ? { curso: "" } : {}),
    }));
    setErrores((actuales) => ({ ...actuales, [name]: undefined }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const nuevosErrores = validar(valores);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    const exito = await onEnviar({
      nombre: valores.nombre.trim(),
      email: valores.email.trim(),
      cedula: valores.cedula,
      telefono: valores.telefono,
      descripcion: curso.descripcion,
      fecha: valores.fecha,
      categoria: valores.categoria,
      curso: valores.curso,
    });

    if (exito) {
      setValores(VALORES_INICIALES);
      setErrores({});
    }
  }

  return (
    <form className="formulario-inscripcion" onSubmit={manejarEnvio} noValidate>
      <Campo etiqueta="Nombre del participante" error={errores.nombre}>
        <input
          name="nombre"
          autoComplete="name"
          value={valores.nombre}
          onChange={manejarCambio}
          placeholder="Ana Martínez"
        />
      </Campo>

      <Campo etiqueta="Correo electrónico" error={errores.email}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={valores.email}
          onChange={manejarCambio}
          placeholder="ana@gmail.com"
        />
      </Campo>

      <Campo etiqueta="Cédula" error={errores.cedula}>
        <input
          name="cedula"
          inputMode="numeric"
          maxLength={10}
          value={valores.cedula}
          onChange={manejarCambio}
          placeholder="0912345675"
        />
      </Campo>

      <Campo etiqueta="Teléfono" error={errores.telefono}>
        <input
          name="telefono"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={valores.telefono}
          onChange={manejarCambio}
          placeholder="0991234567"
        />
      </Campo>

      <Campo etiqueta="Categoría" error={errores.categoria}>
        <select name="categoria" value={valores.categoria} onChange={manejarCambio}>
          <option value="">Selecciona una categoría</option>
          {CATEGORIAS.map((item) => (
            <option key={item.nombre} value={item.nombre}>
              {item.nombre}
            </option>
          ))}
        </select>
      </Campo>

            <Campo etiqueta="Curso" error={errores.curso}>
        <select
          name="curso"
          value={valores.curso}
          onChange={manejarCambio}
          disabled={!categoria}
        >
          <option value="">Selecciona un curso</option>
          {categoria?.cursos.map((item) => (
            <option key={item.nombre} value={item.nombre}>
              {item.nombre}
            </option>
          ))}
        </select>
      </Campo>

      {curso && (
        <p className="descripcion-curso">
          <strong>Descripción del curso:</strong> {curso.descripcion}
        </p>
      )}

      <Campo etiqueta="Fecha de inicio" error={errores.fecha}>
        <input
          name="fecha"
          type="date"
          min={hoy()}
          value={valores.fecha}
          onChange={manejarCambio}
        />
      </Campo>

      <button type="submit" disabled={enviando}>
        {enviando ? "Enviando..." : "Registrar inscripción"}
      </button>
    </form>
  );
}

function Campo({ etiqueta, error, children }) {
  const id = `campo-${etiqueta.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <label className={error ? "campo-inscripcion campo-inscripcion-error" : "campo-inscripcion"} htmlFor={id}>
      <span>{etiqueta}</span>
      {cloneElement(children, {
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": error ? `${id}-error` : undefined,
      })}
      {error && <small id={`${id}-error`}>{error}</small>}
    </label>
  );
}

export default FormularioInscripcion;
