# ZapatoFlex E-Commerce Platform

ZapatoFlex es una plataforma integral de comercio electrónico para la venta de calzado deportivo y casual. Desarrollado como Producto Mínimo Viable (MVP) para una prueba técnica, cuenta con un robusto Backend en **Node.js + PostgreSQL** y un panel cliente/administrativo en el Frontend levantado con **Angular 18**.

## ✨ Características Principales

### Para el Cliente
- **Catálogo Dinámico**: Visualización de productos con filtros interactivos por Categoría, Talla, Precio y Color.
- **Autenticación y Sesiones**: Registro protegido y Login centralizado manejado vía JWT y LocalStorage.
- **Carrito de Compras**: Gestión de ítems en carrito (agregar, remover, actualizar cantidad) en tiempo real con _Angular Signals_ para un performance inigualable.
- **Checkout Contraentrega**: Integración de sistema transaccional. Crea órdenes e histórico y vacía de forma atómica el carrito al terminar.
- **Mis Compras**: Dashboard para que el usuario consulte todos los pedidos que ha realizado.

### Para el Administrador (Back-Office)
- Ingreso seguro con ROL `ADMIN` utilizando la cuenta (`admin@zapatoflex.com` | Pwd: `admin123`).
- **Gestión de Catálogo (CRUD)**: Listar, eliminar y añadir nuevos modelos al catálogo con soporte para imágenes (URLs públicas).
- **Gestión de Inventario (CRUD)**: Creación dinámica de Tallas y asignación de Stock para cada modelo de calzado, afectando la disponibilidad del catálogo al usuario final.

---

## 🏗 Arquitectura del Sistema

* **Estructura Creada**: Arquitectura basada en la separación por capas (Modelos, Repositorios, Servicios, Controladores).
* **Frontend**: Angular 18 con Standalone Components. Diseño con variables CSS Nativas, Glassmorphism, y UI reactiva 100% (RxJS + Signals).
* **Backend**: Node.js + Express + TypeScript. Validación de Middlewares y roles.
* **Base de Datos**: PostgreSQL alojado en Vercel Postgres, conectado y migrado con Sequelize ORM.
* **Documentación API**: Desplegado localmente con Swagger-UI (`http://localhost:3000/api/docs`).

---

## 🚀 Despliegue Local / Guía de Instalación

1. Clona el Repositorio de GitHub en la ruta de tu preferencia.  
2. Abre dos terminales (una para cada servicio).

### Iniciar el Backend
\`\`\`bash
cd zapatoflex/backend
npm install
npm run dev
# Se correrá en http://localhost:3000
\`\`\`
*(Asegúrate de configurar tu cadena de conexión `POSTGRES_URL` en el entorno `.env` si corres en otra Base de Datos).*

### Iniciar el Frontend (Angular)
\`\`\`bash
cd zapatoflex/frontend
npm install
npm start
# Se correrá en http://localhost:4200
\`\`\`

*(Nota: El sistema automáticamente creará la base de datos las primeras veces que se inicialice. Utiliza el script `src/scripts/initRoles.ts` compilándolo si deseas inyectar los roles base)*.

---

## 🎨 Diseño Visual
Se privilegió un diseño Aesthetic y de vanguardia, huyendo del minimalismo soso en pos de una identidad visual completa (Uso constante de Lila Pastel, Azul Claro, Sombras tenues y micro-animaciones en CSS) para la mejor experiencia al usuario.

Desarrollado con 💻 para el reto técnico de Comfenalco Tolima.
