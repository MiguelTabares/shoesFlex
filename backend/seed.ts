import { Producto } from './src/models/producto.model';
import { Inventario } from './src/models/inventario.model';
import { deaultDbContext } from './src/config/database';
import { CategoriaProducto } from './src/models/types';

const productosMock = [
    {
        nombre: 'Nike Air Max 270',
        descripcion: 'Zapatillas deportivas cómodas y ligeras para el día a día o correr con amortiguación premium.',
        precio: 150.00,
        marca: 'Nike',
        color: 'Rojo/Negro',
        categoria: CategoriaProducto.DEPORTIVO,
        imagen_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'Vans Old Skool',
        descripcion: 'Estilo clásico skate, lona resistente y la icónica franja lateral (sidestripe).',
        precio: 75.00,
        marca: 'Vans',
        color: 'Blanco/Negro',
        categoria: CategoriaProducto.CASUAL,
        imagen_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'Nike Air Force 1',
        descripcion: 'El modelo atemporal de Nike, color blanco puro, que combina con cualquier outfit urbano.',
        precio: 120.00,
        marca: 'Nike',
        color: 'Blanco',
        categoria: CategoriaProducto.CASUAL,
        imagen_url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'Adidas Ultraboost',
        descripcion: 'Retorno de energía increíble, suela Continental para máximo agarre.',
        precio: 180.00,
        marca: 'Adidas',
        color: 'Negro',
        categoria: CategoriaProducto.DEPORTIVO,
        imagen_url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'Oxford Classic',
        descripcion: 'Zapatos formales de cuero genuino, ideales para traje y eventos de gala.',
        precio: 130.00,
        marca: 'Artisan',
        color: 'Marrón Oscuro',
        categoria: CategoriaProducto.FORMAL,
        imagen_url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'Chelsea Boots',
        descripcion: 'Botas Chelsea de gamuza, elásticas a los lados para un calce fácil y look sofisticado.',
        precio: 145.00,
        marca: 'London Walk',
        color: 'Beige',
        categoria: CategoriaProducto.CASUAL,
        imagen_url: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'Puma RS-X',
        descripcion: 'Zapatillas audaces retro-future con detalles voluminosos y colores contrastantes.',
        precio: 110.00,
        marca: 'Puma',
        color: 'Multicolor',
        categoria: CategoriaProducto.DEPORTIVO,
        imagen_url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'Reebok Classic Leather',
        descripcion: 'Pura nostalgia, cuero suave y confort que nunca pasa de moda.',
        precio: 85.00,
        marca: 'Reebok',
        color: 'Blanco',
        categoria: CategoriaProducto.CASUAL,
        imagen_url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'Jordan 1 Retro High',
        descripcion: 'Las zapatillas más hypeadas, historia viva del baloncesto y la moda streetwear.',
        precio: 250.00,
        marca: 'Nike / Jordan',
        color: 'Rojo/Negro/Blanco',
        categoria: CategoriaProducto.DEPORTIVO,
        imagen_url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'Timberland Premium Boot',
        descripcion: 'Botas impermeables originales, robustas y preparadas para cualquier clima.',
        precio: 199.00,
        marca: 'Timberland',
        color: 'Amarillo Mostaza',
        categoria: CategoriaProducto.CASUAL,
        imagen_url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'Converse Chuck Taylor All Star',
        descripcion: 'El icono indiscutible. Zapatillas de lona altas que mejoran con el desgaste.',
        precio: 65.00,
        marca: 'Converse',
        color: 'Negro',
        categoria: CategoriaProducto.CASUAL,
        imagen_url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'Derby Suela Goma',
        descripcion: 'Elegancia formal con un toque contemporáneo gracias a su suela de caucho.',
        precio: 115.00,
        marca: 'Artisan',
        color: 'Negro',
        categoria: CategoriaProducto.FORMAL,
        imagen_url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    {
        nombre: 'New Balance 574',
        descripcion: 'Comodidad inigualable con perfil retro. Espuma EVA en entresuela.',
        precio: 95.00,
        marca: 'New Balance',
        color: 'Gris',
        categoria: CategoriaProducto.CASUAL,
        imagen_url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },

    {
        nombre: 'Mocasines Italianos',
        descripcion: 'Mocasines sin cordones para eventos donde destacar sin esfuerzo es la clave.',
        precio: 175.00,
        marca: 'BellaVita',
        color: 'Marrón Claro',
        categoria: CategoriaProducto.FORMAL,
        imagen_url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    }
];

const tallasDisponibles = ['38', '39', '40', '41', '42', '43', '44'];

async function seed() {
    console.log('Iniciando poblamiento de base de datos...');
    await deaultDbContext();

    try {
        console.log('Limpiando inventario y productos...');
        await Inventario.destroy({ where: {} });
        await Producto.destroy({ where: {} });

        for (const prodData of productosMock) {
            const producto: any = await Producto.create(prodData as any);
            console.log(`✅ Producto insertado: ${producto.nombre}`);

            // Crear inventario aleatorio para este producto
            const numTallas = Math.floor(Math.random() * 4) + 2; // Entre 2 y 5 tallas por zapato

            // shuffle tallas y coger las primeras numTallas
            const tallasShuffled = [...tallasDisponibles].sort(() => 0.5 - Math.random());
            const tallasSeleccionadas = tallasShuffled.slice(0, numTallas);

            for (const talla of tallasSeleccionadas) {
                const stock = Math.floor(Math.random() * 20) + 5; // Stock entre 5 y 24
                await Inventario.create({
                    producto_id: producto.id,
                    talla,
                    stock
                } as any);
            }
            console.log(`   -> Generado inventario de ${numTallas} tallas distintas para ${producto.nombre}.`);
        }

        console.log('🎉 Poblamiento finalizado con éxito!');
    } catch (error) {
        console.error('❌ Error poblado BD:', error);
    }

    process.exit(0);
}

seed();
