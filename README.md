# POSTABLE API

Este proyecto implementa la creación de un **RESTful API** para una red social que permita a los usuarios interactuar con publicaciones (Posts).

## Requerimientos Técnicos

Se estará usando base de Datos en PostgreSQL. Se necesita:

- Usuario [usuario] en postgres con permisos de admin
- Crear una base de datos [admin-database] con el usuario admin

## Pasos para ejecutar el proyecto:

### 1. En tu terminal:

```
git clone git@github.com:Kath17/Postable-API.git
```

### 2. Instalar dependencias:

```
npm install
```

### 3. Configurar archivos .env y .env.test:

- .env

```
PGHOST=localhost
PGDATABASE=detailed-queries
PGPORT=5432
PGUSER=[usuario]
PGPASSWORD=[password]
PGADMINDATABASE=[admin-database]
```

- .env.test

```
PGHOST=localhost
PGDATABASE=detailed-queries
PGPORT=5432
PGUSER=[usuario]
PGPASSWORD=[password]
PGADMINDATABASE=[admin-database]
```

- Nota: PGDATABASE es el nombre de la base de datos que usarás para este proyecto y PGADMINDATABASE es la base de datos ya creada con permisos de admin que especificamos al inicio.

### 4. Creamos la base de datos:

Crearemos la base da datos usando el siguiente script:

```
npm run db:create
```

### 5. Creamos las tablas:

Crea las tablas especificadas en `src/db/migrations` usando:

```
npm run db:migrate up
```

### 6. Iniciamos el servidor:

```
npm run dev
```

### 7. Correr los test:

```
npm run test
```

### 8. Otros scripts para migraciones (Opcional):

- Puedes encontrar scripts adicionales si lo necesitas en el `package.json`

```json {4-6}
"scripts": {
  // ...
  "db:migrate": "ts-node src/db/scripts/dbMigrate.ts",
  "db:create": "ts-node src/db/scripts/dbCreate.ts",
  "db:drop": "ts-node src/db/scripts/dbDrop.ts && rm -f src/db/migrations/migrations.json",
  "db:reset": "npm run db:drop && npm run db:create && npm run db:migrate up"
},
```

Usa:

- `db:create`: Para ejecuta el archivo `dbMigrate.ts`
- `db:drop`: Ejecuta el archivo `dbDrop.ts` y luego borrar el archivo json de migraciones (`migrations.json`). Lo hacemos para que, al volver a crear la base de datos, podemos volver a correr todas las migraciones desde cero.
- `db:reset`: Ejecuta los scripts `db:drop` y `db:create` y luego corre todas las migraciones ejecutando `db:migrate up`.

- Si necesitas agregar migraciones nuevas corre el siguiente comando:

```
npm run db:migrate create -- --name [nombre-de-tu-mgiracion].ts
```

## Para usar el RESTUL API puedes probar:

### 1. Visualización de Posts

#### GET "/":

- Usa GET / para recibir todos los posts.
- Para retornar una lista de posts disponibles en la plataforma, con opciones de paginación, filtrado por usuario y ordenación:
- GET /?order=DESC&username=[tu-user]&limit=3&page=1&orderBy=updatedat

#### GET "/:username":

- Muestra los posts de un usuario específico con opciones de paginación y ordenación.
- GET /[tu-user]?order=DESC&limit=3&page=1&orderBy=updatedat

### 2. Interacción de Usuarios Registrados

#### POST "/posts":

- Descripción: Permite a un usuario registrado crear un nuevo post.
- Body:

```
{
"content": "Texto del post".
}
```

#### PATCH "/posts/:id" para Editar el Post:

- Descripción: Permite a un usuario registrado editar un post existente.
- Parámetros URL:

```
id: ID del post a editar.
```

- Body:

```
{
"content": "Texto editado del post".
}
```

#### POST /posts/:postId/like para darle Like a un post:

- Descripción: Permite a un usuario registrado dar "Like" a un post.
  Parámetros:

```
postId: ID del post a dar like.
```

#### POST /posts/:postId/like para darle Like a un post:

- Descripción: Permite a un usuario eliminar su "Like" de un post.
  Parámetros:

```
postId: ID del post a remover like.
```

### 3. Registro y Autenticación de Usuarios

#### POST "/signup":

- Descripción: Permite a un nuevo usuario registrarse en la plataforma.
- Body:

```
{
"username": "username"
"password": "123456",
}
```

#### POST "/login":

- Descripción: Permite a un usuario existente iniciar sesión.
- Body:

```
{
"username": "username"
"password": "123456",
}
```

### 4. Gestión de Perfil de Usuario

Se debe haber hecho /login antes.

#### GET "/me":

- Descripción: Muestra el perfil del usuario autenticado.

#### PATCH "/me":

- Descripción: Permite al usuario editar su información de perfil.
- Body:

```
{
"email": "email@gmail.com"
"firstName": "USER",
"lastName": "LASTNAME"
}
```

#### DELETE "/me":

- Descripción: Permite al usuario eliminar su cuenta.
