const express = require("express");
const cors = require("cors");
const fs = require("node:fs/promises");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000;

const ARCHIVO_DATOS = path.join(__dirname, "data", "registros.json");
const FRONTEND = path.join(__dirname, "../frontend/dist");

app.use(cors());
app.use(express.json());
app.use(express.static(FRONTEND));


// Categorías y cursos permitidos (los mismos de frontend/src/data/categorias.js)
const CATALOGO = {
  "Tecnología": ["SQL Server", "Desarrollo web con React", "Node.js y Express", "Python desde cero"],
  "Idiomas": ["Inglés básico", "Inglés intermedio", "Portugués", "Francés"],
  "Arte y diseño": ["Diseño gráfico", "Ilustración digital", "Fotografía", "Diseño UX/UI"],
  "Negocios": ["Emprendimiento", "Marketing digital", "Finanzas personales", "Excel para negocios"],
  "Salud": ["Primeros auxilios", "Nutrición saludable", "Yoga y bienestar", "Salud mental"]
};

// Solo letras (con tildes y ñ) y un espacio entre palabras
const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+( [A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/;

// Fecha de hoy en formato AAAA-MM-DD
function fechaHoy() {
  const hoy = new Date();
  hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
  return hoy.toISOString().slice(0, 10);
}

function validarFecha(fecha) {
  if (typeof fecha !== "string") {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);

  const fechaComprobada = new Date(0);
  fechaComprobada.setUTCHours(0, 0, 0, 0);
  fechaComprobada.setUTCFullYear(anio, mes - 1, dia);

  return (
    fechaComprobada.getUTCFullYear() === anio &&
    fechaComprobada.getUTCMonth() === mes - 1 &&
    fechaComprobada.getUTCDate() === dia
  );
}

function validarCedula(cedula) {
  if (typeof cedula !== "string" || !/^\d{10}$/.test(cedula)) {
    return false;
  }

  const provincia = Number(cedula.slice(0, 2));
  const tercerDigito = Number(cedula[2]);

  if (provincia < 1 || provincia > 24 || tercerDigito > 5) {
    return false;
  }

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];

  const suma = coeficientes.reduce((total, coeficiente, indice) => {
    let producto = Number(cedula[indice]) * coeficiente;

    if (producto >= 10) {
      producto -= 9;
    }

    return total + producto;
  }, 0);

  const verificador = (10 - (suma % 10)) % 10;

  return verificador === Number(cedula[9]);
}

async function leerRegistros() {
  try {
    const contenido = await fs.readFile(ARCHIVO_DATOS, "utf8");
    const registros = JSON.parse(contenido);

    if (!Array.isArray(registros)) {
      throw new Error("El archivo JSON debe contener una lista.");
    }

    return registros;
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.mkdir(path.dirname(ARCHIVO_DATOS), {
        recursive: true
      });

      await fs.writeFile(ARCHIVO_DATOS, "[]", "utf8");
      return [];
    }

    throw error;
  }
}

async function guardarRegistros(registros) {
  await fs.writeFile(
    ARCHIVO_DATOS,
    JSON.stringify(registros, null, 2),
    "utf8"
  );
}

app.get("/registros", async (req, res) => {
  try {
    const registros = await leerRegistros();

    res.status(200).json(registros);
  } catch (error) {
    console.error("Error al leer registros:", error);

    res.status(500).json({
      error: "No se pudieron consultar las inscripciones."
    });
  }
});

let colaRegistros = Promise.resolve();

app.post("/registros", (req, res) => {
  const procesarRegistro = async () => {
    try {
      const {
        nombre,
        email,
        telefono,
        cedula,
        descripcion,
        fecha,
        categoria,
        curso
      } = req.body || {};

      if (
        typeof nombre !== "string" ||
        !nombre.trim() ||
        typeof email !== "string" ||
        !email.trim() ||
        typeof telefono !== "string" ||
        !telefono.trim() ||
        typeof cedula !== "string" ||
        !cedula.trim() ||
        typeof descripcion !== "string" ||
        !descripcion.trim() ||
        typeof categoria !== "string" ||
        !categoria.trim() ||
        typeof curso !== "string" ||
        !curso.trim() ||
        !fecha
      ) {
        return res.status(400).json({
          error: "Todos los campos son obligatorios."
        });
      }

      if (!SOLO_LETRAS.test(nombre.trim()) || nombre.trim().length < 3) {
        return res.status(400).json({
          error: "El nombre solo puede tener letras y espacios (mínimo 3 letras)."
        });
      }

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      );

      if (!emailValido) {
        return res.status(400).json({
          error: "El correo electrónico no tiene un formato válido."
        });
      }

      if (!validarFecha(fecha)) {
        return res.status(400).json({
          error: "La fecha debe ser válida y tener el formato AAAA-MM-DD."
        });
      }

            if (fecha < fechaHoy()) {
        return res.status(400).json({
          error: "La fecha de inicio no puede ser anterior a hoy."
        });
      }

      const cursosDeCategoria = CATALOGO[categoria.trim()];

      if (!cursosDeCategoria) {
        return res.status(400).json({
          error: "La categoría seleccionada no existe."
        });
      }

      if (!cursosDeCategoria.includes(curso.trim())) {
        return res.status(400).json({
          error: "El curso no pertenece a la categoría seleccionada."
        });
      }

      if (!/^0\d{8,9}$/.test(telefono.trim())) {
        return res.status(400).json({
          error: "El teléfono debe tener 9 o 10 dígitos y comenzar con 0."
        });
      }

      if (!validarCedula(cedula.trim())) {
        return res.status(400).json({
          error: "La cédula ecuatoriana no es válida."
        });
      }

      const registros = await leerRegistros();

      const siguienteId =
        registros.reduce((maximo, registro) => {
          const id = registro.id;

          return typeof id === "number" &&
            Number.isSafeInteger(id) &&
            id > maximo
            ? id
            : maximo;
        }, 0) + 1;

      if (!Number.isSafeInteger(siguienteId)) {
        throw new Error("No se puede generar otro ID numérico.");
      }

      const nuevoRegistro = {
        id: siguienteId,
        nombre: nombre.trim(),
        email: email.trim(),
        telefono: telefono.trim(),
        cedula: cedula.trim(),
        descripcion: descripcion.trim(),
        fecha,
        categoria: categoria.trim(),
        curso: curso.trim()
      };

      registros.push(nuevoRegistro);

      await guardarRegistros(registros);

      return res.status(201).json({
        mensaje: "Inscripción registrada correctamente.",
        registro: nuevoRegistro
      });
    } catch (error) {
      console.error("Error al guardar registro:", error);

      return res.status(500).json({
        error: "No se pudo guardar la inscripción."
      });
    }
  };

  colaRegistros = colaRegistros.then(
    procesarRegistro,
    procesarRegistro
  );
});

app.get("/{*ruta}", (req, res, next) => {
  if (req.path.startsWith("/registros")) {
    return next();
  }

  res.sendFile(path.join(FRONTEND, "index.html"), (error) => {
    if (error) {
      next(error);
    }
  });
});

app.use((error, req, res, next) => {
  // Si el cuerpo de la petición no es un JSON válido se responde 400
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "El cuerpo de la petición no es un JSON válido."
    });
  }

  console.error("Error del servidor:", error);

  if (req.path.startsWith("/registros")) {
    return res.status(500).json({
      error: "Error interno del servidor."
    });
  }

  return res.status(500).send(
    "No se pudo cargar la aplicación."
  );
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
