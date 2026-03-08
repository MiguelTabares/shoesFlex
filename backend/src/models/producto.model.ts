import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { CategoriaProducto, Producto as IProducto } from './types';

export class Producto extends Model<IProducto> implements IProducto {
    declare id: string;
    declare nombre: string;
    declare descripcion: string;
    declare precio: number;
    declare marca: string;
    declare color: string;
    declare categoria: CategoriaProducto;
    declare imagen_url?: string;
    declare readonly creado_en: Date;
}

Producto.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        marca: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        color: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        categoria: {
            type: DataTypes.ENUM(...Object.values(CategoriaProducto)),
            allowNull: false,
        },
        imagen_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        creado_en: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'productos',
        timestamps: false,
    }
);
