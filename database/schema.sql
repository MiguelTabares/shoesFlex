-- =================================================================================
-- Script Inicial de Base de Datos para ZapatoFlex (PostgreSQL en Vercel)
-- =================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================
-- 1. TIPOS DE DATOS Y ENUMS
-- ==========================
CREATE TYPE rol_usuario AS ENUM ('ADMIN', 'CLIENTE');
CREATE TYPE categoria_producto AS ENUM ('DEPORTIVO', 'CASUAL', 'FORMAL');
CREATE TYPE estado_carrito AS ENUM ('ACTIVO', 'ABANDONADO', 'COMPLETADO');
CREATE TYPE estado_pedido AS ENUM ('PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO');

-- ==========================
-- 2. TABLAS PRINCIPALES
-- ==========================

-- Usuarios: Puede ser Admin o Cliente
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol rol_usuario DEFAULT 'CLIENTE' NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Productos: Contiene la información general del zapato
CREATE TABLE productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    categoria categoria_producto NOT NULL,
    imagen_url TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventario: Administra el stock específico combinando modelo y talla
CREATE TABLE inventario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    talla VARCHAR(10) NOT NULL,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    UNIQUE(producto_id, talla) -- Evitar tallas duplicadas para un mismo producto
);

-- Carrito: Representa la sesión de compras del usuario
CREATE TABLE carrito (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    estado estado_carrito DEFAULT 'ACTIVO' NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carrito Items: Los productos específicos (e inventario) que se agregan al carrito
CREATE TABLE carrito_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    carrito_id UUID NOT NULL REFERENCES carrito(id) ON DELETE CASCADE,
    inventario_id UUID NOT NULL REFERENCES inventario(id) ON DELETE CASCADE,
    cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0)
);

-- Pedidos: El historial inmutable de compras completadas
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL,
    estado estado_pedido DEFAULT 'PENDIENTE' NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items Pedido: Las líneas de detalle del pedido con el precio histórico congelado
CREATE TABLE items_pedido (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    inventario_id UUID REFERENCES inventario(id) ON DELETE SET NULL, -- Si se borra el inventario no perdemos la data del pedido
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL -- Precio al momento de la compra
);

-- ==========================
-- 3. ÍNDICES DE RENDIMIENTO
-- ==========================
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_carrito_usuario ON carrito(usuario_id);
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_inventario_producto ON inventario(producto_id);
