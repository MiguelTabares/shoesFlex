import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Producto } from './producto.model';
import { Inventario as IInventario } from './types';

export class Inventario extends Model<IInventario> implements IInventario {
    declare id: string;
    declare producto_id: string;
    declare talla: string;
    declare stock: number;
    declare readonly producto?: Producto;
}

Inventario.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        producto_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'productos',
                key: 'id'
            }
        },
        talla: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        }
    },
    {
        sequelize,
        tableName: 'inventario',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['producto_id', 'talla']
            }
        ]
    }
);

Producto.hasMany(Inventario, { foreignKey: 'producto_id', as: 'inventarios' });
Inventario.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });
