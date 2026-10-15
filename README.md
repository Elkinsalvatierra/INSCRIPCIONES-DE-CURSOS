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

Agrega esta sección al final de tu `README.md`:

```markdown
# Frontend

El frontend es una aplicación SPA desarrollada con React, Vite y React Router. Se encuentra dentro de la carpeta `frontend` y se comunica con el backend mediante las rutas `/registros`.

## Instalar las dependencias del frontend

Desde la carpeta raíz del proyecto ejecutamos:

```bash
cd frontend
npm install
```

Esto instala React, React DOM, React Router y las herramientas de desarrollo de Vite.

## Iniciar el frontend

Con el backend ejecutándose en una terminal, abrimos otra terminal, entramos en la carpeta `frontend` y ejecutamos:

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

Para que el frontend pueda comunicarse con el backend, este debe estar disponible en:

```text
http://localhost:3000
```

Si se necesita utilizar otra dirección, copiamos `.env.example` como `.env` y configuramos:

```env
VITE_API_URL=http://localhost:3000
```

## Páginas y navegación

El frontend incluye las siguientes rutas:

- `/`: página de inicio con la bienvenida y las categorías disponibles.
- `/categoria/:nombre`: catálogo de cursos de una categoría seleccionada.
- `/registro`: formulario para crear una inscripción.
- `/lista`: consulta y muestra las inscripciones guardadas mediante `GET /registros`.

La navegación principal se encuentra en:

```text
frontend/src/components/Menu.jsx
```

Las rutas se configuran en:

```text
frontend/src/App.jsx
```

## Categorías y catálogo de cursos

Las categorías y sus cursos se encuentran en:

```text
frontend/src/data/categorias.js
```

Actualmente están disponibles:

- Tecnología
- Idiomas
- Arte y diseño
- Negocios
- Salud

Cada categoría contiene una descripción, un color y un catálogo de cursos. Cada curso incluye su nombre, descripción e imagen.

Las tarjetas de categorías y cursos se muestran mediante los siguientes componentes:

```text
frontend/src/components/TarjetaCategoria.jsx
frontend/src/components/TarjetaCurso.jsx
```

## Formulario y lista de inscripciones

El formulario se encuentra en:

```text
frontend/src/components/FormularioInscripcion.jsx
```

Este componente administra los datos ingresados y muestra los mensajes de validación. El envío se realiza mediante `POST /registros`, utilizando el servicio:

```text
frontend/src/services/api.js
```

La lista de inscripciones se encuentra en:

```text
frontend/src/pages/Lista.jsx
```

Esta página consulta `GET /registros`, muestra los estados de carga, error y lista vacía, y permite filtrar las inscripciones por categoría.

## Validar el frontend

Para generar una compilación de producción ejecutamos desde la carpeta `frontend`:

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
├── public/
├── src/
│   ├── components/
│   │   ├── FiltroCategorias.jsx
│   │   ├── FormularioInscripcion.jsx
│   │   ├── IconoCategoria.jsx
│   │   ├── Mensaje.jsx
│   │   ├── Menu.jsx
│   │   ├── Pie.jsx
│   │   ├── TarjetaCategoria.jsx
│   │   ├── TarjetaCurso.jsx
│   │   └── TarjetaInscripcion.jsx
│   ├── data/
│   │   └── categorias.js
│   ├── pages/
│   │   ├── Categoria.jsx
│   │   ├── Inicio.jsx
│   │   ├── Lista.jsx
│   │   ├── NoEncontrado.jsx
│   │   └── Registro.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── package-lock.json
```

## Ejecutar el proyecto completo

Para ejecutar el proyecto completo se utilizan dos terminales.

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

Después abrimos la siguiente dirección en el navegador:

```text
http://localhost:5173
```

El frontend consumirá la API del backend en:

```text
http://localhost:3000
``` 
