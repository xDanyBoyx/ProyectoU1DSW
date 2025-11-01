# Documentación API - Tienda en Línea

## Información General

**Proyecto:** ProyectoU1DSW - Desarrollo de Servicios Web  
**Tecnología:** Node.js + Express.js  
**Autenticación:** JWT (JSON Web Tokens)  
**Base de Datos:** Sistema de gestión de usuarios y productos  
**Integración:** Facturapi (para gestión fiscal)

---

## Índice

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Productos](#productos)
4. [Códigos de Estado HTTP](#códigos-de-estado-http)
5. [Modelos de Datos](#modelos-de-datos)

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

## Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Credenciales inválidas o token expirado |
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

## Integración con Facturapi

El sistema se integra con Facturapi para:

- **Usuarios:** Crear clientes automáticamente al registrarse
- **Productos:** Registrar productos para facturación electrónica

Ambas operaciones almacenan el `id_facturapi` para futuras referencias.

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

---

## Notas Importantes

1. **Autenticación JWT:** Actualmente desactivada para testing. En producción, todos los endpoints excepto `/api/auth/*` requieren token JWT.

2. **Contraseñas:** Se almacenan encriptadas usando bcrypt con salt rounds por defecto.

3. **Facturapi:** Todas las operaciones de creación (usuarios y productos) interactúan con la API de Facturapi.

4. **Validaciones:** El sistema incluye validaciones personalizadas en `utils/validations.js` para usuarios y productos.

5. **Filtros:** Tanto usuarios como productos soportan filtrado mediante query parameters.

---

## Contacto y Soporte

**Proyecto:** ProyectoU1DSW  
**Repositorio:** [GitHub - xDanyBoyx/ProyectoU1DSW](https://github.com/xDanyBoyx/ProyectoU1DSW)

---

**Versión de la Documentación:** 1.0  
**Última Actualización:** Octubre 2025