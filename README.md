# 👟 ZapatoFlex — Plataforma E-Commerce de Calzado

ZapatoFlex es una plataforma de comercio electrónico especializada en la venta de calzado deportivo y casual. Desarrollada como **Producto Mínimo Viable (MVP)** para una prueba técnica, implementa un ecosistema Full-Stack completo con Backend REST en **Node.js + TypeScript** y un panel interactivo en **Angular 18**, ambos desplegados en **Vercel** con base de datos **Neon PostgreSQL**.

**🔗 Links en Producción:**
- **Frontend:** https://shoesflex-frontend.vercel.app
- **Backend API:** https://shoesflex-backend.vercel.app/api
- **Documentación Swagger:** https://shoesflex-backend.vercel.app/api/docs

---

## 🏛️ Arquitectura de Software

### Arquitectura General: Cliente-Servidor (Monorepo)

El sistema adopta el patrón **Cliente-Servidor desacoplado** con dos aplicaciones independientes que coexisten en un mismo repositorio (**Monorepo**):

```
Cliente (Angular SPA) ──── HTTP/REST ────► Servidor (Node.js API)
                                                     │
                                                     ▼
                                           Base de Datos (PostgreSQL)
```

Esta separación permite que cada capa evolucione de forma independiente: el Frontend puede reemplazarse (ej. React Native para móvil) sin tocar el Backend, y viceversa.

---

### Backend: Arquitectura en Capas (Layered Architecture)

El Backend implementa una **Arquitectura de 4 Capas** inspirada en los principios de _Clean Architecture_ y _Domain-Driven Design_:

```
[ HTTP Request ]
      │
      ▼
┌─────────────┐
│   Routes    │  ← Define los endpoints y aplica middlewares (Auth JWT)
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Controllers    │  ← Recibe la Request, valida entrada, delega al Service
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Services     │  ← Contiene la lógica de negocio pura
└────────┬────────┘
         │
         ▼
┌──────────────────┐
│  Repositories    │  ← Única capa que toca la BD (Sequelize ORM)
└────────┬─────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │  ← Base de datos relacional (Neon/Vercel)
└─────────────────┘
```

**¿Por qué esta arquitectura?**

| Principio | Beneficio en ZapatoFlex |
|---|---|
| **Separación de responsabilidades (SRP)** | Cada capa tiene una única razón para cambiar. Si cambia la BD, solo se toca el Repository. |
| **Testabilidad** | Se pueden hacer unit tests de Services inyectando Repositories mock sin tocar la BD real. |
| **Mantenibilidad** | Un desarrollador nuevo puede orientarse fácilmente: rutas → controladores → servicios → BD. |
| **Escalabilidad** | Al crecer el negocio, se puede extraer cada módulo (Auth, Pedidos, Inventario) en microservicios independientes sin reescribir la lógica. |

---

### Frontend: Arquitectura basada en Componentes (Component-Based Architecture)

El Frontend sigue la arquitectura nativa de **Angular** con **Standalone Components** (Angular 18+), eliminando la necesidad de NgModules y facilitando el _tree-shaking_ (eliminación de código muerto en producción).

```
AppComponent (Root)
│
├── app.routes.ts        ← Enrutamiento declarativo
│
├── Pages (Vistas)
│   ├── CatalogComponent    ← Vista pública del catálogo con filtros
│   ├── LoginComponent      ← Login / Registro unificado con query params
│   ├── CartComponent       ← Carrito + Formulario de Checkout
│   ├── OrdersComponent     ← Historial de pedidos del usuario
│   └── AdminComponent      ← Panel de administración (CRUD)
│
└── Services (Lógica de negocio del cliente)
    ├── AuthService         ← JWT, login, registro, rol del usuario
    ├── CartService         ← Estado global del carrito con Signals
    ├── ProductService      ← Catálogo, filtros, CRUD admin
    └── OrderService        ← Checkout y pedidos
```

**Patrones clave usados:**
- **Angular Signals** para el estado reactivo del carrito (sin necesidad de Redux/NgRx).
- **Standalone Components** para mayor rendimiento y carga condicional.
- **Services como Singletons** (providedIn: 'root') para estado compartido eficiente.
- **Environment files + Prebuild Script** para inyección dinámica de URLs de API según el entorno (local vs. Vercel).

---

## 📁 Estructura de Carpetas

```
zapatoflex/                          ← Raíz del Monorepo
├── README.md
├── .gitignore
│
├── backend/                         ← Aplicación Node.js/Express
│   ├── vercel.json                  ← Configuración de despliegue Serverless
│   ├── tsconfig.json                ← Configuración TypeScript
│   ├── package.json
│   ├── swagger.json                 ← Definición OpenAPI 3.0 (raíz)
│   └── src/
│       ├── server.ts                ← Entry point: inicia el servidor y exporta app
│       ├── app.ts                   ← Configura Express, CORS, rutas y Swagger
│       ├── swagger.json             ← Copia interna para resolución en Vercel Serverless
│       │
│       ├── config/
│       │   └── database.ts          ← Conexión a PostgreSQL usando Sequelize
│       │
│       ├── models/                  ← Definición de entidades de BD (Sequelize)
│       │   ├── types.ts             ← Interfaces y Enums TypeScript compartidos
│       │   ├── usuario.model.ts
│       │   ├── rol.model.ts
│       │   ├── producto.model.ts
│       │   ├── inventario.model.ts
│       │   ├── carrito.model.ts
│       │   ├── carrito-item.model.ts
│       │   ├── pedido.model.ts
│       │   └── item-pedido.model.ts
│       │
│       ├── repositories/            ← Capa de acceso a datos (consultas SQL)
│       │   ├── usuario.repository.ts
│       │   ├── product.repository.ts
│       │   ├── inventario.repository.ts
│       │   └── carrito.repository.ts
│       │
│       ├── services/                ← Lógica de negocio pura
│       │   ├── auth.service.ts      ← Hashing de contraseñas, generación JWT
│       │   ├── product.service.ts
│       │   ├── inventario.service.ts
│       │   └── carrito.service.ts
│       │
│       ├── controllers/             ← Manejo de Requests/Responses HTTP
│       │   ├── auth.controller.ts
│       │   ├── product.controller.ts
│       │   ├── inventario.controller.ts
│       │   ├── carrito.controller.ts
│       │   └── pedido.controller.ts ← Gestiona checkout con transacciones atómicas
│       │
│       ├── routes/                  ← Definición de endpoints REST
│       │   ├── auth.routes.ts
│       │   ├── product.routes.ts
│       │   ├── inventario.routes.ts
│       │   ├── carrito.routes.ts
│       │   └── pedido.routes.ts
│       │
│       ├── middlewares/
│       │   └── auth.middleware.ts   ← Validación y decodificación de JWT
│       │
│       └── scripts/
│           ├── syncDb.ts            ← Sincroniza modelos con la BD (alter)
│           └── initRoles.ts         ← Inserta roles ADMIN y CLIENTE
│
└── frontend/                        ← Aplicación Angular 18
    ├── package.json
    ├── angular.json
    ├── scripts/
    │   └── set-env.js               ← Prebuild: inyecta API_URL desde variable de entorno
    └── src/
        ├── styles.css               ← Variables CSS globales (Design System)
        ├── environments/
        │   ├── environment.ts       ← Producción (generado por set-env.js)
        │   └── environment.development.ts  ← Desarrollo local
        └── app/
            ├── app.component.*      ← Shell: Navbar + Router Outlet
            ├── app.routes.ts        ← Rutas declarativas
            │
            ├── models/
            │   └── types.ts         ← Interfaces TypeScript del dominio
            │
            ├── services/            ← Comunicación con la API y estado global
            │   ├── auth.service.ts
            │   ├── cart.service.ts  ← Estado reactivo con Angular Signals
            │   ├── product.service.ts
            │   └── order.service.ts
            │
            └── pages/               ← Componentes de vistas (Standalone)
                ├── catalog/         ← Catálogo público con filtros dinámicos
                ├── login/           ← Login y Registro unificado
                ├── cart/            ← Carrito + Checkout contraentrega
                ├── orders/          ← Historial de compras del usuario
                └── admin/           ← Panel administrativo (CRUD)
```

---

## 🗃️ Modelo de Datos (Entidad-Relación)

```
Usuario ──┬── Carrito ──── CarritoItem ──── Inventario ──── Producto
          │                                                    │
          └── Pedido  ──── ItemPedido  ──── Inventario ────────┘
                │
               Rol
```

| Entidad | Descripción |
|---|---|
| `Usuario` | Comprador o Administrador. Tiene un Rol asignado. |
| `Rol` | ADMIN o CLIENTE. Controla el acceso a las vistas. |
| `Producto` | Artículo del catálogo (nombre, marca, color, precio, imagen). |
| `Inventario` | Talla + Stock de un Producto. Puede haber múltiples tallas por producto. |
| `Carrito` | Estado: ACTIVO, ABANDONADO o COMPLETADO. Uno por usuario activo. |
| `CarritoItem` | Relación Carrito ↔ Inventario con cantidad. |
| `Pedido` | Orden de compra generada al hacer checkout. Contiene el total. |
| `ItemPedido` | Snapshot del Inventario + precio al momento de la compra. Inmutable. |

---

## 🚀 Guía de Instalación Local

### Pre-requisitos
- Node.js v18+
- PostgreSQL (local o cadena de conexión remota)
- Angular CLI: `npm install -g @angular/cli`

### 1. Clonar el repositorio
```bash
git clone https://github.com/MiguelTabares/shoesFlex.git
cd shoesFlex
```

### 2. Backend
```bash
cd backend
npm install
```

Crea el archivo `.env` con:
```env
POSTGRES_URL=postgresql://usuario:password@host/db?sslmode=require
JWT_SECRET=tu_clave_secreta_super_segura
```

```bash
npm run dev
# API disponible en http://localhost:3000
# Swagger UI en http://localhost:3000/api/docs
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
# App disponible en http://localhost:4200
```

---

## 🔐 Credenciales de Prueba (Producción)

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@zapatoflex.com` | `admin123` |
| Cliente | Regístrate desde la app | La que elijas |

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend Framework | Angular | 18 |
| Estado Reactivo | Angular Signals + RxJS | Nativo |
| Backend Framework | Express.js | 4.x |
| Lenguaje | TypeScript | 5.x |
| ORM | Sequelize | 6.x |
| Base de Datos | PostgreSQL (Neon) | 16 |
| Autenticación | JSON Web Tokens (JWT) | — |
| Cifrado | bcryptjs | 3.x |
| Documentación API | Swagger UI (OpenAPI 3.0) | 5.x |
| Hosting | Vercel (Serverless) | — |

---

Desarrollado con 💻 por **Miguel Tabares** para la prueba técnica de Comfenalco Tolima — SmartFit.
