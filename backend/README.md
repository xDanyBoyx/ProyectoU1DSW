# Documentación API - Tienda en Línea

---

## Ejemplos de Uso

### Ejemplo 1: Registro e Inicio de Sesión

```bash
# 1. Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "password": "miPassword123",
    "mail": "juan@example.com",
    "role": "cliente",
    "domicile": {
      "cp": "63114",
      "calle": "tucan",
      "numeroExt": "25",
      "colonia": "Ecologistas",
      "ciudad": "tepic",
      "municipio": "tepic",
      "estado": "nayarit"
    },
    "rfc": "PEMJ900101XXX",
    "rf": "601",
    "phone": "5551234567"
  }'

# 2. Iniciar sesión
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "mail": "juan@example.com",
    "password": "miPassword123"
  }'
```

### Ejemplo 2: Crear y Consultar Producto

```bash
# 1. Crear producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop HP",
    "brand": "HP",
    "stock": 10,
    "price": 15999.99,
    "category": "Electrónica",
    "urlimg": "https://example.com/laptop.jpg",
    "codesat": "43211500"
  }'

# 2. Obtener todos los productos
curl -X GET http://localhost:3000/api/products

# 3. Filtrar productos por categoría
curl -X GET "http://localhost:3000/api/products?category=Electrónica"
```

### Ejemplo 3: Actualizar y Eliminar

```bash
# 1. Actualizar producto
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop HP Pavilion",
    "brand": "HP",
    "stock": 8,
    "price": 14999.99,
    "category": "Electrónica",
    "urlimg": "https://example.com/laptop-new.jpg",
    "codesat": "43211500"
  }'

# 2. Eliminar producto
curl -X DELETE http://localhost:3000/api/products/1
```

### Ejemplo 4: Operaciones de Carrito

```bash
# 1. Agregar productos al carrito (crea uno nuevo si no existe)
curl -X POST http://localhost:3000/api/cart/ \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      { "id": "prod001", "qty": 2 },
      { "id": "prod002", "qty": 1 }
    ]
  }'

# 2. Obtener carrito actual del usuario
curl -X GET http://localhost:3000/api/cart/ \
  -H "Authorization: Bearer eyJhbGc..."

# 3. Obtener todos los carritos (requiere permisos)
curl -X GET http://localhost:3000/api/cart/all \
  -H "Authorization: Bearer eyJhbGc..."

# 4. Actualizar cantidad de producto en carrito
curl -X POST http://localhost:3000/api/cart/products/prod001 \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{ "qty": 5 }'

# 5. Eliminar producto del carrito
curl -X DELETE http://localhost:3000/api/cart/products/prod001 \
  -H "Authorization: Bearer eyJhbGc..."

# 6. Vaciar carrito
curl -X DELETE http://localhost:3000/api/cart/clear \
  -H "Authorization: Bearer eyJhbGc..."
```

### Ejemplo 5: Gestión de Usuarios

```bash
# 1. Obtener todos los usuarios
curl -X GET http://localhost:3000/api/users

# 2. Obtener usuario por ID
curl -X GET http://localhost:3000/api/users/5

# 3. Crear usuario
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García",
    "password": "segura123",
    "mail": "maria@example.com",
    "role": "cliente",
    "domicile": {
      "cp": "28001",
      "calle": "Gran Vía",
      "numeroExt": "150",
      "colonia": "Centro",
      "ciudad": "Madrid",
      "municipio": "Madrid",
      "estado": "Madrid"
    },
    "rfc": "GARM850315XXX",
    "rf": "601",
    "phone": "5559876543"
  }'

# 4. Actualizar usuario
curl -X PUT http://localhost:3000/api/users/5 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "María García López",
    "phone": "5551111111"
  }'

# 5. Eliminar usuario
curl -X DELETE http://localhost:3000/api/users/5
```

---

## Reglas de Negocio

### Carrito
- Solo usuarios con rol 'cliente' pueden crear y modificar carritos
- Un usuario solo puede tener un carrito activo (paidAt = null)
- Si se agrega un producto que ya existe, se incrementa su cantidad
- El IVA se calcula automáticamente como 16% del subtotal
- El total es la suma del subtotal más el IVA
- La cantidad debe ser siempre un número positivo

### Autenticación
- Todos los endpoints de carrito requieren token JWT válido
- El token expira después de 1 hora
- Solo usuarios autenticados pueden acceder a sus carritos
- Usuarios con rol 'cliente' tienen acceso a su carrito personal

### Productos
- Los códigos SAT son obligatorios para facturación
- El stock debe ser un número no negativo
- Los precios deben ser mayores a cero

---

## Notas Importantes

1. **Autenticación JWT:** Actualmente desactivada para testing en usuarios y productos. En producción, todos los endpoints excepto `/api/auth/*` requieren token JWT. El carrito ya requiere autenticación.

2. **Contraseñas:** Se almacenan encriptadas usando bcrypt con salt rounds por defecto.

3. **Facturapi:** Todas las operaciones de creación (usuarios y productos) interactúan con la API de Facturapi.

4. **Validaciones:** El sistema incluye validaciones personalizadas en `utils/validations.js` para usuarios y productos.

5. **Filtros:** Tanto usuarios como productos soportan filtrado mediante query parameters.

6. **Base de Datos:** El carrito se almacena en Firebase Firestore, mientras que usuarios y productos pueden estar en otra BD.

7. **IVA:** El porcentaje de IVA es fijo en 16%. Si necesita cambiar, actualice el código en `cart.controller.js`.

---

## Estructura del Proyecto

```
project/
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── product.controller.js
│   └── cart.controller.js
├── models/
│   ├── user.model.js
│   ├── product.model.js
│   └── cart.model.js
├── middleware/
│   └── auth.middleware.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── product.routes.js
│   └── cart.routes.js
├── utils/
│   └── validations.js
├── db/
│   └── firebase.js
└── app.js
```

---

## Variables de Entorno Recomendadas

```
# Autenticación
JWT_SECRET=your_secret_key_here

# Facturapi
FACTURAPI_API_KEY=your_facturapi_key
FACTURAPI_SECRET=your_facturapi_secret

# Stripe
STRIPE_API_KEY=your_stripe_key
STRIPE_SECRET=your_stripe_secret

# Firebase
FIREBASE_API_KEY=your_firebase_key
FIREBASE_AUTH_DOMAIN=your_firebase_domain
FIREBASE_PROJECT_ID=your_firebase_project
FIREBASE_STORAGE_BUCKET=your_firebase_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=ecommerce_db

# Server
PORT=3000
NODE_ENV=development
```

---

## Troubleshooting

### Error 401 Unauthorized
- Verifica que el token JWT sea válido
- Comprueba que el token no haya expirado
- Asegúrate de incluir el token en el header `Authorization: Bearer {token}`

### Error 403 Forbidden
- Verifica el rol del usuario
- Solo usuarios con rol 'cliente' pueden usar los endpoints de carrito
- Algunos endpoints pueden requerir rol 'admin'

### Error 404 Not Found
- Verifica que el ID del recurso sea correcto
- Asegúrate de que el recurso exista en la base de datos
- Revisa la URL del endpoint

### Error 500 Internal Server Error
- Revisa los logs del servidor
- Verifica las conexiones a servicios externos (Facturapi, Stripe)
- Comprueba la conexión a la base de datos

---

## Contacto y Soporte

**Proyecto:** ProyectoU1DSW  
**Repositorio:** [GitHub - xDanyBoyx/ProyectoU1DSW](https://github.com/xDanyBoyx/ProyectoU1DSW)

---

**Versión de la Documentación:** 2.0  
**Última Actualización:** Noviembre 2025 Información General

**Proyecto:** ProyectoU1DSW - Desarrollo de Servicios Web  
**Tecnología:** Node.js + Express.js  
**Autenticación:** JWT (JSON Web Tokens)  
**Base de Datos:** Sistema de gestión de usuarios, productos y carritos  
**Integración:** Facturapi (para gestión fiscal), Stripe (para pagos)

---

## Índice

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Productos](#productos)
4. [Carrito](#carrito)
5. [Códigos de Estado HTTP](#códigos-de-estado-http)
6. [Modelos de Datos](#modelos-de-datos)

---

## Autenticación

### Base URL
```
/api/auth
```

### 1. Registro de Usuario

**Endpoint:** `POST /api/auth/register`

**Descripción:** Registra un nuevo usuario en el sistema y crea un cliente en Facturapi.

**Body (JSON):**
```json
{
  "name": "string",
  "password": "string",
  "mail": "string",
  "role": "string",
  "domicile": {
    "cp": "string",
    "calle": "string",
    "numeroExt": "string",
    "colonia": "string",
    "ciudad": "string",
    "municipio": "string",
    "estado": "string"
  },
  "rfc": "string",
  "rf": "string",
  "phone": "string"
}
```

**Parámetros:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | string | Sí | Nombre completo del usuario |
| password | string | Sí | Contraseña del usuario |
| mail | string | Sí | Correo electrónico único |
| role | string | No | Rol del usuario ('admin' o 'cliente'). Default: 'cliente' |
| domicile | object | Sí | Objeto con la dirección completa del usuario |
| domicile.cp | string | Sí | Código postal |
| domicile.calle | string | Sí | Nombre de la calle |
| domicile.numeroExt | string | Sí | Número exterior |
| domicile.colonia | string | Sí | Colonia |
| domicile.ciudad | string | Sí | Ciudad |
| domicile.municipio | string | Sí | Municipio |
| domicile.estado | string | Sí | Estado |
| rfc | string | Sí | RFC del usuario |
| rf | string | Sí | Régimen fiscal |
| phone | string | Sí | Teléfono de contacto |

**Respuesta Exitosa (201):**
```json
{
  "message": "Usuario registrado correctamente",
  "user": {
    "id": "number",
    "name": "string",
    "mail": "string",
    "role": "string",
    "domicile": {
      "cp": "string",
      "calle": "string",
      "numeroExt": "string",
      "colonia": "string",
      "ciudad": "string",
      "municipio": "string",
      "estado": "string"
    },
    "rfc": "string",
    "rf": "string",
    "phone": "string",
    "id_facturapi": "string"
  }
}
```

**Errores Posibles:**
- `400 Bad Request`: Errores de validación
- `409 Conflict`: El correo ya está registrado
- `500 Internal Server Error`: Error al crear usuario en Facturapi o BD

---

### 2. Inicio de Sesión

**Endpoint:** `POST /api/auth/login`

**Descripción:** Autentica un usuario y devuelve un token JWT.

**Body (JSON):**
```json
{
  "mail": "string",
  "password": "string"
}
```

**Parámetros:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| mail | string | Sí | Correo electrónico del usuario |
| password | string | Sí | Contraseña del usuario |

**Respuesta Exitosa (200):**
```json
{
  "token": "string (JWT)"
}
```

**Payload del Token JWT:**
```json
{
  "id": "number",
  "mail": "string",
  "role": "string",
  "exp": "timestamp"
}
```

**Errores Posibles:**
- `400 Bad Request`: Faltan campos obligatorios
- `401 Unauthorized`: Credenciales inválidas
- `500 Internal Server Error`: Error del servidor

---

## Usuarios

### Base URL
```
/api/users
```

**Nota:** Todas las rutas de usuarios requieren autenticación JWT (actualmente desactivado para testing).

### 1. Obtener Todos los Usuarios

**Endpoint:** `GET /api/users`

**Descripción:** Obtiene todos los usuarios o usuarios filtrados.

**Query Parameters (Opcionales):**
```
/api/users?name=Juan&role=cliente
```

**Parámetros de Filtrado:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| name | string | Filtrar por nombre |
| mail | string | Filtrar por correo |
| role | string | Filtrar por rol |
| rfc | string | Filtrar por RFC |
| phone | string | Filtrar por teléfono |

**Respuesta Exitosa (200):**
```json
[
  {
    "userid": "number",
    "name": "string",
    "mail": "string",
    "role": "string",
    "domicile": {
      "cp": "string",
      "calle": "string",
      "numeroExt": "string",
      "colonia": "string",
      "ciudad": "string",
      "municipio": "string",
      "estado": "string"
    },
    "rfc": "string",
    "rf": "string",
    "phone": "string",
    "id_facturapi": "string"
  }
]
```

**Errores Posibles:**
- `500 Internal Server Error`: Error al consultar la base de datos

---

### 2. Obtener Usuario por ID

**Endpoint:** `GET /api/users/:id`

**Descripción:** Obtiene un usuario específico por su ID.

**Parámetros de URL:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | number | ID del usuario |

**Ejemplo:**
```
GET /api/users/5
```

**Respuesta Exitosa (200):**
```json
{
  "userid": "number",
  "name": "string",
  "mail": "string",
  "role": "string",
  "domicile": {
    "cp": "string",
    "calle": "string",
    "numeroExt": "string",
    "colonia": "string",
    "ciudad": "string",
    "municipio": "string",
    "estado": "string"
  },
  "rfc": "string",
  "rf": "string",
  "phone": "string",
  "id_facturapi": "string"
}
```

**Errores Posibles:**
- `404 Not Found`: Usuario no encontrado
- `500 Internal Server Error`: Error del servidor

---

### 3. Crear Usuario

**Endpoint:** `POST /api/users`

**Descripción:** Crea un nuevo usuario en el sistema.

**Body (JSON):**
```json
{
  "name": "string",
  "password": "string",
  "mail": "string",
  "role": "string",
  "domicile": {
    "cp": "string",
    "calle": "string",
    "numeroExt": "string",
    "colonia": "string",
    "ciudad": "string",
    "municipio": "string",
    "estado": "string"
  },
  "rfc": "string",
  "rf": "string",
  "phone": "string"
}
```

**Parámetros:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | string | Sí | Nombre completo del usuario |
| password | string | Sí | Contraseña del usuario |
| mail | string | Sí | Correo electrónico único |
| role | string | No | Rol del usuario. Default: 'cliente' |
| domicile | object | Sí | Objeto con la dirección completa del usuario |
| domicile.cp | string | Sí | Código postal |
| domicile.calle | string | Sí | Nombre de la calle |
| domicile.numeroExt | string | Sí | Número exterior |
| domicile.colonia | string | Sí | Colonia |
| domicile.ciudad | string | Sí | Ciudad |
| domicile.municipio | string | Sí | Municipio |
| domicile.estado | string | Sí | Estado |
| rfc | string | Sí | RFC del usuario |
| rf | string | Sí | Régimen fiscal |
| phone | string | Sí | Teléfono de contacto |

**Respuesta Exitosa (201):**
```json
{
  "message": "Usuario registrado correctamente",
  "user": {
    "id": "number",
    "name": "string",
    "mail": "string",
    "role": "string",
    "domicile": {
      "cp": "string",
      "calle": "string",
      "numeroExt": "string",
      "colonia": "string",
      "ciudad": "string",
      "municipio": "string",
      "estado": "string"
    },
    "rfc": "string",
    "rf": "string",
    "phone": "string",
    "id_facturapi": "string"
  }
}
```

**Errores Posibles:**
- `400 Bad Request`: Errores de validación
- `409 Conflict`: El correo ya está registrado
- `500 Internal Server Error`: Error al crear usuario

---

### 4. Actualizar Usuario

**Endpoint:** `PUT /api/users/:id`

**Descripción:** Actualiza la información de un usuario existente.

**Parámetros de URL:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | number | ID del usuario a actualizar |

**Body (JSON):**
```json
{
  "name": "string",
  "password": "string",
  "mail": "string",
  "role": "string",
  "domicile": {
    "cp": "string",
    "calle": "string",
    "numeroExt": "string",
    "colonia": "string",
    "ciudad": "string",
    "municipio": "string",
    "estado": "string"
  },
  "rfc": "string",
  "rf": "string",
  "phone": "string"
}
```

**Ejemplo:**
```
PUT /api/users/5
```

**Respuesta Exitosa (200):**
```json
{
  "userid": "number",
  "name": "string",
  "mail": "string",
  "role": "string",
  "domicile": {
    "cp": "string",
    "calle": "string",
    "numeroExt": "string",
    "colonia": "string",
    "ciudad": "string",
    "municipio": "string",
    "estado": "string"
  },
  "rfc": "string",
  "rf": "string",
  "phone": "string",
  "id_facturapi": "string"
}
```

**Errores Posibles:**
- `400 Bad Request`: Errores de validación
- `404 Not Found`: Usuario no encontrado
- `500 Internal Server Error`: Error del servidor

---

### 5. Eliminar Usuario

**Endpoint:** `DELETE /api/users/:id`

**Descripción:** Elimina un usuario del sistema.

**Parámetros de URL:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | number | ID del usuario a eliminar |

**Ejemplo:**
```
DELETE /api/users/5
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Usuario eliminado correctamente"
}
```

**Errores Posibles:**
- `404 Not Found`: Usuario no encontrado
- `500 Internal Server Error`: Error del servidor

---

## Productos

### Base URL
```
/api/products
```

**Nota:** Todas las rutas de productos requieren autenticación JWT (actualmente desactivado para testing).

### 1. Obtener Todos los Productos

**Endpoint:** `GET /api/products`

**Descripción:** Obtiene todos los productos o productos filtrados.

**Query Parameters (Opcionales):**
```
/api/products?category=electrónica&brand=Samsung
```

**Parámetros de Filtrado:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| name | string | Filtrar por nombre |
| brand | string | Filtrar por marca |
| category | string | Filtrar por categoría |
| price | number | Filtrar por precio |
| stock | number | Filtrar por stock |

**Respuesta Exitosa (200):**
```json
[
  {
    "productid": "number",
    "name": "string",
    "brand": "string",
    "stock": "number",
    "price": "number",
    "category": "string",
    "urlimg": "string",
    "codesat": "string",
    "id_facturapi": "string"
  }
]
```

**Errores Posibles:**
- `500 Internal Server Error`: Error al consultar la base de datos

---

### 2. Obtener Producto por ID

**Endpoint:** `GET /api/products/:id`

**Descripción:** Obtiene un producto específico por su ID.

**Parámetros de URL:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | number | ID del producto |

**Ejemplo:**
```
GET /api/products/10
```

**Respuesta Exitosa (200):**
```json
{
  "productid": "number",
  "name": "string",
  "brand": "string",
  "stock": "number",
  "price": "number",
  "category": "string",
  "urlimg": "string",
  "codesat": "string",
  "id_facturapi": "string"
}
```

**Errores Posibles:**
- `404 Not Found`: Producto no encontrado
- `500 Internal Server Error`: Error del servidor

---

### 3. Crear Producto

**Endpoint:** `POST /api/products`

**Descripción:** Crea un nuevo producto en el sistema y en Facturapi.

**Body (JSON):**
```json
{
  "name": "string",
  "brand": "string",
  "stock": "number",
  "price": "number",
  "category": "string",
  "urlimg": "string",
  "codesat": "string"
}
```

**Parámetros:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | string | Sí | Nombre del producto |
| brand | string | Sí | Marca del producto |
| stock | number | Sí | Cantidad en stock |
| price | number | Sí | Precio del producto |
| category | string | Sí | Categoría del producto |
| urlimg | string | Sí | URL de la imagen |
| codesat | string | Sí | Código SAT para facturación |

**Respuesta Exitosa (201):**
```json
{
  "message": "Producto registrado correctamente",
  "product": {
    "productid": "number",
    "name": "string",
    "brand": "string",
    "stock": "number",
    "price": "number",
    "category": "string",
    "urlimg": "string",
    "codesat": "string",
    "id_facturapi": "string"
  }
}
```

**Errores Posibles:**
- `400 Bad Request`: Errores de validación
- `500 Internal Server Error`: Error al crear producto

---

### 4. Actualizar Producto

**Endpoint:** `PUT /api/products/:id`

**Descripción:** Actualiza la información de un producto existente.

**Parámetros de URL:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | number | ID del producto a actualizar |

**Body (JSON):**
```json
{
  "name": "string",
  "brand": "string",
  "stock": "number",
  "price": "number",
  "category": "string",
  "urlimg": "string",
  "codesat": "string"
}
```

**Ejemplo:**
```
PUT /api/products/10
```

**Respuesta Exitosa (200):**
```json
{
  "productid": "number",
  "name": "string",
  "brand": "string",
  "stock": "number",
  "price": "number",
  "category": "string",
  "urlimg": "string",
  "codesat": "string",
  "id_facturapi": "string"
}
```

**Errores Posibles:**
- `400 Bad Request`: Errores de validación
- `404 Not Found`: Producto no encontrado
- `500 Internal Server Error`: Error del servidor

---

### 5. Eliminar Producto

**Endpoint:** `DELETE /api/products/:id`

**Descripción:** Elimina un producto del sistema.

**Parámetros de URL:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | number | ID del producto a eliminar |

**Ejemplo:**
```
DELETE /api/products/10
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Producto eliminado correctamente"
}
```

**Errores Posibles:**
- `404 Not Found`: Producto no encontrado
- `500 Internal Server Error`: Error del servidor

---

## Carrito

### Base URL
```
/api/cart
```

**Autenticación:** Requerida (JWT) para todos los endpoints

### 1. Obtener Carrito Actual del Usuario

**Endpoint:** `GET /api/cart/`

**Descripción:** Obtiene el carrito activo (no pagado) del usuario autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (201):**
```json
{
  "id": "abc123xyz",
  "user": {
    "id": "user123",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "products": [
    {
      "product": {
        "id": "prod001",
        "price": 3200
      },
      "qty": 2,
      "subtotal": 6400
    }
  ],
  "subtotal": 6400,
  "iva": 1024,
  "total": 7424,
  "createdAt": "2025-01-15T10:30:00Z",
  "paidAt": null,
  "id_facturapi": null,
  "id_stripe": null
}
```

**Errores Posibles:**
- `404`: El usuario no existe
- `403`: El usuario no tiene rol de 'cliente'
- `500`: Error interno del servidor

---

### 2. Agregar Productos al Carrito

**Endpoint:** `POST /api/cart/`

**Descripción:** Agrega productos al carrito activo del usuario. Si no existe carrito activo, crea uno nuevo.

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "products": [
    {
      "id": "prod001",
      "qty": 2
    },
    {
      "id": "prod002",
      "qty": 1
    }
  ]
}
```

**Response (200 o 201):**
```json
{
  "id": "cart456",
  "user": { },
  "products": [
    {
      "product": {
        "id": "prod001",
        "price": 3200
      },
      "qty": 2,
      "subtotal": 6400
    },
    {
      "product": {
        "id": "prod002",
        "price": 24999
      },
      "qty": 1,
      "subtotal": 24999
    }
  ],
  "subtotal": 31399,
  "iva": 5023.84,
  "total": 36422.84,
  "createdAt": "2025-01-15T10:30:00Z",
  "paidAt": null,
  "id_facturapi": null,
  "id_stripe": null
}
```

**Comportamiento:**
- Si el producto ya existe en el carrito, incrementa la cantidad
- Si es un producto nuevo, lo agrega al carrito
- Recalcula automáticamente subtotal, IVA (16%) y total

**Errores Posibles:**
- `500`: Error al crear o actualizar el carrito

---

### 3. Obtener Todos los Carritos

**Endpoint:** `GET /api/cart/all`

**Descripción:** Obtiene la lista de todos los carritos del sistema.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "id": "cart123",
    "user": { },
    "products": [ ],
    "subtotal": 6400,
    "iva": 1024,
    "total": 7424,
    "createdAt": "2025-01-15T10:30:00Z",
    "paidAt": null,
    "id_facturapi": null,
    "id_stripe": null
  },
  {
    "id": "cart456",
    "user": { },
    "products": [ ],
    "subtotal": 31399,
    "iva": 5023.84,
    "total": 36422.84,
    "createdAt": "2025-01-15T11:00:00Z",
    "paidAt": "2025-01-15T12:00:00Z",
    "id_facturapi": "fact789",
    "id_stripe": "stripe456"
  }
]
```

**Errores Posibles:**
- `500`: Error al consultar los carritos

---

### 4. Actualizar Cantidad de Producto en el Carrito

**Endpoint:** `POST /api/cart/products/:productId`

**Descripción:** Actualiza la cantidad de un producto específico en el carrito activo del usuario.

**Parameters:**
- `productId` (string): ID del producto a actualizar

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "qty": 5
}
```

**Response (200):**
```json
{
  "id": "cart123",
  "user": { },
  "products": [
    {
      "product": {
        "id": "prod001",
        "price": 3200
      },
      "qty": 5,
      "subtotal": 16000
    }
  ],
  "subtotal": 16000,
  "iva": 2560,
  "total": 18560,
  "createdAt": "2025-01-15T10:30:00Z",
  "paidAt": null,
  "id_facturapi": null,
  "id_stripe": null
}
```

**Errores Posibles:**
- `404`: No existe carrito activo o el producto no está en el carrito
- `500`: Error al actualizar el carrito

---

### 5. Eliminar Producto del Carrito

**Endpoint:** `DELETE /api/cart/products/:productId`

**Descripción:** Remueve un producto del carrito activo del usuario.

**Parameters:**
- `productId` (string): ID del producto a eliminar

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "cart123",
  "user": { },
  "products": [],
  "subtotal": 0,
  "iva": 0,
  "total": 0,
  "createdAt": "2025-01-15T10:30:00Z",
  "paidAt": null,
  "id_facturapi": null,
  "id_stripe": null
}
```

**Errores Posibles:**
- `404`: No existe carrito activo o el producto no está en el carrito
- `500`: Error al actualizar el carrito

---

### 6. Vaciar Carrito

**Endpoint:** `DELETE /api/cart/clear`

**Descripción:** Elimina todos los productos del carrito activo del usuario, dejándolo vacío.

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "cart123",
  "user": { },
  "products": [],
  "subtotal": 0,
  "iva": 0,
  "total": 0,
  "createdAt": "2025-01-15T10:30:00Z",
  "paidAt": null,
  "id_facturapi": null,
  "id_stripe": null
}
```

**Errores Posibles:**
- `404`: No existe carrito activo
- `500`: Error al actualizar el carrito

---

## Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Credenciales inválidas o token expirado |
| 403 | Forbidden | Acceso prohibido (rol insuficiente) |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: correo duplicado) |
| 500 | Internal Server Error | Error interno del servidor |

---

## Modelos de Datos

### Usuario

```javascript
{
  userid: number,           // ID único del usuario
  name: string,             // Nombre completo
  password: string,         // Contraseña encriptada (bcrypt)
  mail: string,             // Correo electrónico único
  role: string,             // 'admin' o 'cliente'
  domicile: {               // Dirección completa del usuario
    cp: string,             // Código postal
    calle: string,          // Nombre de la calle
    numeroExt: string,      // Número exterior
    colonia: string,        // Colonia
    ciudad: string,         // Ciudad
    municipio: string,      // Municipio
    estado: string          // Estado
  },
  rfc: string,              // RFC para facturación
  rf: string,               // Régimen fiscal
  phone: string,            // Teléfono de contacto
  id_facturapi: string      // ID del cliente en Facturapi
}
```

### Producto

```javascript
{
  productid: number,        // ID único del producto
  name: string,             // Nombre del producto
  brand: string,            // Marca del producto
  stock: number,            // Cantidad disponible
  price: number,            // Precio del producto
  category: string,         // Categoría del producto
  urlimg: string,           // URL de la imagen
  codesat: string,          // Código SAT
  id_facturapi: string      // ID del producto en Facturapi
}
```

### Carrito

```javascript
{
  id: string,               // ID único del carrito (UUID)
  user: {                   // Información del usuario propietario
    id: string,             // ID del usuario
    name: string,           // Nombre del usuario
    email: string           // Correo del usuario
  },
  products: [               // Array de productos en el carrito
    {
      product: {
        id: string,         // ID del producto
        price: number       // Precio unitario
      },
      qty: number,          // Cantidad
      subtotal: number      // price * qty
    }
  ],
  subtotal: number,         // Suma de todos los subtotales
  iva: number,              // 16% del subtotal
  total: number,            // subtotal + iva
  createdAt: timestamp,     // Fecha de creación
  paidAt: timestamp | null, // Fecha de pago (null si no pagado)
  id_facturapi: string,     // ID en Facturapi
  id_stripe: string         // ID en Stripe
}
```

---

## Autenticación JWT

### Header de Autenticación

Para endpoints protegidos, incluir el token JWT en el header:

```
Authorization: Bearer <token>
```

### Configuración JWT

- **Secret:** Definido en variable de entorno `JWT_SECRET` (default: "1234")
- **Expiración:** 1 hora
- **Algoritmo:** HS256 (HMAC SHA-256)

### Estructura del Token

```json
{
  "id": "number",
  "mail": "string",
  "role": "string",
  "iat": "timestamp",
  "exp": "timestamp"
}
```

---

## Integración con Servicios Externos

### Facturapi

El sistema se integra con Facturapi para:

- **Usuarios:** Crear clientes automáticamente al registrarse
- **Productos:** Registrar productos para facturación electrónica
- **Carritos:** Generar invoices cuando se paga

Ambas operaciones almacenan el `id_facturapi` para futuras referencias.

### Stripe

Se utiliza Stripe para procesamiento de pagos. El `id_stripe` se almacena en el carrito después de un pago exitoso.

---

## Validaciones

### Usuarios
- Todos los campos son obligatorios excepto `role`
- El correo debe ser único
- La contraseña se encripta con bcrypt antes de guardarse
- El rol por defecto es 'cliente'

### Productos
- Todos los campos son obligatorios
- Stock y price deben ser números válidos
- El código SAT es requerido para la facturación

### Carrito
- Solo usuarios con rol 'cliente' pueden crear/modificar carritos
- Un usuario solo puede tener un carrito activo (paidAt = null)
- IVA se calcula automáticamente como 16% del subtotal
- La cantidad debe ser un número positivo

---

##