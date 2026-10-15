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

- Comprueba que todos los campos obligatorios estén completos.
- Verifica que el nombre solo tenga letras y espacios, con un mínimo de 3 letras.
- Verifica que el correo electrónico tenga un formato válido.
- Comprueba que la fecha tenga el formato AAAA-MM-DD, exista en el calendario y no sea anterior a hoy.
- Verifica que la categoría exista y que el curso pertenezca a esa categoría.
- Verifica que el teléfono tenga 9 o 10 dígitos y empiece con 0.
- Verifica que la cédula ecuatoriana sea válida (provincia y dígito verificador).
- Si el cuerpo de la petición no es un JSON válido, responde 400 en lugar de 500.

Si los datos son incorrectos, devuelve el código HTTP 400 con un mensaje de error.

# Registros
Las inscripciones se almacenan en el archivo `backend/data/registros.json.`, se comprobó que los datos permanecen guardados después de detener y volver a iniciar el servidor, esto permite conservar las inscripciones sin utilizar una base de datos externa.

# Frontend

El frontend está desarrollado con React, Vite y React Router, y se encuentra dentro de la carpeta `frontend`. Incluye el inicio, las categorías, el catálogo, el formulario de inscripción y la lista de inscripciones conectados con la API.

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

- Página de inicio con las categorías de cursos.
- Catálogo de cursos por categoría.
- Tarjetas reutilizables para categorías (con imagen propia), cursos e inscripciones.
- Formulario de inscripción con validación de nombre (solo letras), correo, cédula, teléfono, fecha, categoría y curso.
- La descripción de la inscripción se toma automáticamente del curso elegido.
- Envío de inscripciones a `POST /registros`.
- Lista de inscripciones obtenidas con `GET /registros`, con filtro por categoría y botón para actualizar.
- Mensajes de carga, error y lista vacía.
- Mensaje "¡Inscripción completada con éxito!" al registrar una inscripción.
- Botones para volver al catálogo, a las categorías o al inicio.
- Menú de navegación y pie de página en todas las páginas.
- Página 404 para rutas que no existen.
- Estilos globales, colores por categoría y diseño adaptable a celular.

## Rutas disponibles

```text
/                         Página de inicio
/categoria/:nombre        Catálogo de cursos de una categoría
/registro                 Formulario de inscripción
/lista                    Inscripciones registradas
/lista?categoria=Idiomas  Inscripciones filtradas por categoría
*                         Página no encontrada (404)
```

Ejemplos:

```text
http://localhost:5173/
http://localhost:5173/categoria/Tecnología
http://localhost:5173/registro
http://localhost:5173/lista
http://localhost:5173/lista?categoria=Idiomas
```

## Categorías disponibles

- Tecnología
- Idiomas
- Arte y diseño
- Negocios
- Salud

Cada categoría tiene nombre, color, descripción, una imagen propia (distinta a la de sus cursos) y una lista de cursos con su descripción e imagen.

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
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.svg
└── src/
    ├── App.jsx
    ├── App.css
    ├── main.jsx
    ├── components/
    │   ├── FiltroCategorias.jsx
    │   ├── FormularioInscripcion.jsx
    │   ├── FormularioInscripcion.css
    │   ├── IconoCategoria.jsx
    │   ├── Mensaje.jsx
    │   ├── Menu.jsx
    │   ├── Pie.jsx
    │   ├── TarjetaCategoria.jsx
    │   ├── TarjetaCurso.jsx
    │   └── TarjetaInscripcion.jsx
    ├── data/
    │   └── categorias.js
    ├── pages/
    │   ├── Categoria.jsx
    │   ├── Inicio.jsx
    │   ├── Lista.jsx
    │   ├── NoEncontrado.jsx
    │   ├── Registro.jsx
    │   └── Registro.css
    └── services/
        └── api.js
```

## Descripción de los archivos principales

- `src/main.jsx`: punto de entrada, configura `BrowserRouter` e importa los estilos globales.
- `src/App.jsx`: muestra el menú y el pie, y define todas las rutas.
- `src/App.css`: estilos globales, colores por categoría y diseño para celular.
- `src/pages/Inicio.jsx`: muestra las categorías disponibles.
- `src/pages/Categoria.jsx`: muestra los cursos de la categoría seleccionada.
- `src/pages/Registro.jsx`: presenta el formulario y muestra el mensaje de inscripción completada o el error.
- `src/pages/Lista.jsx`: consulta las inscripciones con `GET /registros` y las filtra por categoría.
- `src/pages/NoEncontrado.jsx`: página 404.
- `src/components/FormularioInscripcion.jsx`: valida los datos y registra la inscripción.
- `src/components/Menu.jsx` y `src/components/Pie.jsx`: navegación y pie de página.
- `src/components/TarjetaInscripcion.jsx`: muestra los datos de una inscripción.
- `src/components/FiltroCategorias.jsx`: botones para filtrar por categoría.
- `src/components/Mensaje.jsx`: mensajes de carga, error e información.
- `src/services/api.js`: funciones `obtenerInscripciones` (GET) y `crearInscripcion` (POST).
- `src/data/categorias.js`: categorías y cursos, y la función `buscarCategoria`.
