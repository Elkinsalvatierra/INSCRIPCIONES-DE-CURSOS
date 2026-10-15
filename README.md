# Inscripciones de cursos
primero verificamos que tenemos node.js instalado si no esta instlado 
lo instalamos desde este enlace `https://nodejs.org/es/download`
y una vez instalada abrimos una terminal y ejecutamos `node -v` si esta instalado sale `v24.21.0` significa que node.js esta instalado, tambien verificamos que `npm` este disponible con el siguiente comando `npm -v` si sale `11.19.0` esta todo bien.

# Crear carpeta del backend
para crear la carpeta del backend vamos a usar los siguientes comandos
`mkdir backend`: crea la carpeta del servidor.

`cd backend`: este comando lo ejecutamos en otra terminal para entrar en la carpeta.

`npm init -y`: este comando genera el archivo package.json dentro de la carpeta backend, donde se configura el proyecto y sus dependencias.

# Instalar las dependencias del backend
dentro de la carpeta ejecutamos los siguiente comando:

`npm install express cors`: este comando sirve para crear las api y para permitir la comunicacion entre el fronted y el backend.

`npm install --save-dev nodemon`: este comando reinicia automáticamente el servidor cuando detecta cambios en los archivos.

# Estructura del backend
Inscripciones-a-cursos/
└── backend/
    ├── data/
    │   └── registros.json
    ├── server.js
    ├── package.json
    └── package-lock.json

# Configuracion en el package.json
en el package.json en la parte del scripts le cambiamos por 
`  "scripts": {`
  `"start": "node server.js",`
  `"dev": "nodemon server.js",`
  `"test": "node --test"`
`},`

Por qué hicimos cada cambio?
- start: para iniciar nuestro servidor con npm start.

- dev: para trabajar y que el servidor se reinicie automáticamente cuando modifiquemos server.js.

- test: para poder ejecutar pruebas automatizadas con el sistema de pruebas integrado de Node.js.

# Iniciar el servidor
para iniciar el servidor abrimos una nueva terminal y ponemos el comando `npm run dev` por que este comando?, porque a medida que vamos actualizando el `server.js` nodemon detecta los cambios y reinicia automaticamente el servidor.

# Comprobar funcionamiento de la API 
con el servidor encendido abrimos el navegador e ingresamos a `localhost:3000/registros` esta direccion corresponde a la ruta `GET/registros` su funcion es consultar las inscripciones que tenemos almacenadas en el archivo `registros.json` si todavia no existen registros el servidor solo se mostrara asi `[]`esto indica que la API responde correctamente y que la lista de inscripciones se encuentra vacía.

# Registrar inscripciones mediante POST
para registrar una nueva inscripcion utilizamos la ruta `POST/registro`, esta ruta recibe los datos del estudiante en formato JSON, verifica que sean validos y los guarda en el archivo `backend/data/registros.json`.

 ## Ejemplo de una inscripción
`{`
  `"nombre": "Ana Martinez",`
  `"email": "ana@gmail.com",`
  `"descripcion": "Inscripcion al curso de bases de datos",`
  `"fecha": "2026-10-14",`
  `"categoria": "Tecnologia",`
  `"curso": "SQL Server"`
`}`

Para probar esta ruta desde PowerShell, con el servidor encendido, ejecutamos:
`$datos = @{`
   `nombre = "Ana Martinez"`
   `email = "ana@gmail.com"`
   `descripcion = "Inscripcion al curso de bases de datos"`
   `fecha = "2026-10-14"`
   `categoria = "Tecnologia"`
   `curso = "SQL Server"`
`} | ConvertTo-Json`

`Invoke-RestMethod -Uri "http://localhost:3000/registros" -Method POST -ContentType "application/json" -Body $datos`

si los datos son correctos, el servidor responde con el codigo HTTP 201 y devuelve la inscripcion creada.

cada inscripcion recibre un identificador numerico unico, el servidor consulta los registros existentes, busca el ID numérico más alto y le suma uno.

# Validacion del backend
El servidor realiza las siguientes validaciones antes de guardar una inscripción:

-Comprueba que todos los campos obligatorios estén completos.

-Verifica que el correo electrónico tenga un formato válido.

-Comprueba que la fecha tenga el formato AAAA-MM-DD y exista en el calendario.

Si los datos son incorrectos, devuelve el código HTTP 400 con un mensaje de error.

# Registros
Las inscripciones se almacenan en el archivo `backend/data/registros.json.`, se comprobó que los datos permanecen guardados después de detener y volver a iniciar el servidor, esto permite conservar las inscripciones sin utilizar una base de datos externa.

```markdown
# Frontend

El frontend está desarrollado con React, Vite y React Router, y se encuentra dentro de la carpeta `frontend`. Incluye el inicio, las categorías, el catálogo y el formulario de inscripción conectado con la API.

## Instalar las dependencias del frontend

Desde la carpeta raíz del proyecto ejecutamos:

```bash
cd frontend
npm install
```

Este comando instala las dependencias definidas en `package.json`.

> La carpeta `node_modules` se genera localmente y no debe subirse al repositorio.

## Iniciar el frontend

Para iniciar la aplicación en modo desarrollo ejecutamos:

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

## Funcionalidades implementadas

La parte desarrollada incluye:

- Página de inicio.
- Visualización de categorías de cursos.
- Catálogo de cursos por categoría.
- Tarjetas reutilizables para categorías.
- Tarjetas reutilizables para cursos.
- Formulario con validación de nombre, correo, cédula, teléfono, descripción, fecha, categoría y curso.
- Envío de inscripciones a `POST /registros`.
- Navegación entre el inicio y las categorías mediante React Router.

## Rutas disponibles

```text
/                         Página de inicio
/categoria/:nombre        Catálogo de cursos de una categoría
/registro                 Formulario de inscripción
```

Ejemplos:

```text
http://localhost:5173/
http://localhost:5173/categoria/Tecnología
http://localhost:5173/categoria/Idiomas
http://localhost:5173/categoria/Negocios
http://localhost:5173/registro
```

## Categorías disponibles

Actualmente el catálogo contiene las siguientes categorías:

- Tecnología
- Idiomas
- Arte y diseño
- Negocios
- Salud

Cada categoría contiene:

- Nombre.
- Color identificador.
- Descripción.
- Lista de cursos.
- Descripción de cada curso.
- Imagen de cada curso.

## Validar el frontend

Para generar una compilación de producción ejecutamos:

```bash
npm run build
```

Para revisar el código con el linter ejecutamos:

```bash
npm run lint
```

## Estructura del frontend

```text
frontend/
├── package.json
├── package-lock.json
├── index.html
├── vite.config.js
├── .env.example
├── .gitignore
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── components/
    │   ├── FormularioInscripcion.jsx
    │   ├── FormularioInscripcion.css
    │   ├── IconoCategoria.jsx
    │   ├── TarjetaCategoria.jsx
    │   └── TarjetaCurso.jsx
    ├── data/
    │   └── categorias.js
    ├── pages/
    │   ├── Categoria.jsx
    │   ├── Inicio.jsx
    │   └── Registro.jsx
    └── services/
        └── api.js
```

## Descripción de los archivos principales

- `src/main.jsx`: punto de entrada de la aplicación y configuración de `BrowserRouter`.
- `src/App.jsx`: configuración de las rutas del inicio y del catálogo.
- `src/pages/Inicio.jsx`: muestra el inicio y las categorías disponibles.
- `src/pages/Categoria.jsx`: muestra los cursos de la categoría seleccionada.
- `src/pages/Registro.jsx`: presenta el formulario y muestra el resultado del envío a la API.
- `src/components/FormularioInscripcion.jsx`: valida los datos y permite registrar la inscripción.
- `src/services/api.js`: envía la inscripción a `POST /registros`.
- `src/data/categorias.js`: contiene las categorías, los cursos, sus descripciones e imágenes.
- `src/components/TarjetaCategoria.jsx`: muestra una tarjeta reutilizable para cada categoría.
- `src/components/TarjetaCurso.jsx`: muestra una tarjeta reutilizable para cada curso.
- `src/components/IconoCategoria.jsx`: muestra el identificador visual de cada categoría.
```
