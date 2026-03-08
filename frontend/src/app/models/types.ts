export enum RolUsuario {
    ADMIN = 'ADMIN',
    CLIENTE = 'CLIENTE'
}

export enum CategoriaProducto {
    DEPORTIVO = 'DEPORTIVO',
    CASUAL = 'CASUAL',
    FORMAL = 'FORMAL'
}

export enum EstadoCarrito {
    ACTIVO = 'ACTIVO',
    ABANDONADO = 'ABANDONADO',
    COMPLETADO = 'COMPLETADO'
}

export enum EstadoPedido {
    PENDIENTE = 'PENDIENTE',
    PAGADO = 'PAGADO',
    ENVIADO = 'ENVIADO',
    ENTREGADO = 'ENTREGADO'
}

export interface Usuario {
    id: string;
    nombre: string;
    email: string;
    password_hash?: string; // Opcional por seguridad cuando va hacia el Frontend
    rol: RolUsuario;
    fecha_registro?: Date;
}

export interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    marca: string;
    color: string;
    categoria: CategoriaProducto;
    imagen_url?: string;
    inventarios?: Inventario[];
    creado_en?: Date;
}

export interface Inventario {
    id: string;
    producto_id: string;
    talla: string;
    stock: number;
    producto?: Producto; // Población relacional
}

export interface Carrito {
    id: string;
    usuario_id: string;
    estado: EstadoCarrito;
    creado_en?: Date;
    actualizado_en?: Date;
    items?: CarritoItem[];
}

export interface CarritoItem {
    id: string;
    carrito_id: string;
    inventario_id: string;
    cantidad: number;
    inventario?: Inventario;
}

export interface Pedido {
    id: string;
    usuario_id: string;
    total: number;
    estado: EstadoPedido;
    fecha_pedido?: Date;
    items?: ItemPedido[];
}

export interface ItemPedido {
    id: string;
    pedido_id: string;
    inventario_id: string;
    cantidad: number;
    precio_unitario: number;
    inventario?: Inventario;
}
