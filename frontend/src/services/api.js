const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export async function obtenerInscripciones() {
  const respuesta = await fetch(`${API_URL}/registros`);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las inscripciones.");
  }

  return respuesta.json();
}
export async function crearInscripcion(inscripcion) {
  const respuesta = await fetch(`${API_URL}/registros`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inscripcion),
  });

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudo registrar la inscripción.");
  }

  return datos.registro;
}
