import { cloneElement, useState } from "react";
import { CATEGORIAS } from "../data/categorias.js";
import "./FormularioInscripcion.css";

const VALORES_INICIALES = {
  nombre: "",
  email: "",
  cedula: "",
  telefono: "",
  descripcion: "",
  fecha: "",
  categoria: "",
  curso: "",
};

function hoy() {
  const fecha = new Date();
  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
  return fecha.toISOString().slice(0, 10);
}

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

  if (!valores.nombre.trim()) {
    errores.nombre = "El nombre es obligatorio.";
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

  if (!valores.descripcion.trim()) {
    errores.descripcion = "La descripción es obligatoria.";
  } else if (valores.descripcion.trim().length < 10) {
    errores.descripcion = "La descripción debe tener al menos 10 caracteres.";
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

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    const valor = name === "cedula" || name === "telefono" ? value.replace(/\D/g, "") : value;

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
      descripcion: valores.descripcion.trim(),
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

      <Campo etiqueta="Fecha de inicio" error={errores.fecha}>
        <input
          name="fecha"
          type="date"
          min={hoy()}
          value={valores.fecha}
          onChange={manejarCambio}
        />
      </Campo>

      <Campo etiqueta="Descripción" error={errores.descripcion}>
        <textarea
          name="descripcion"
          rows="4"
          value={valores.descripcion}
          onChange={manejarCambio}
          placeholder="Motivo de la inscripción o comentarios"
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
