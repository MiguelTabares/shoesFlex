import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { CarritoItem as ICarritoItem } from './types';
import { Carrito } from './carrito.model';
import { Inventario } from './inventario.model';

export class CarritoItem extends Model<ICarritoItem> implements ICarritoItem {
    declare id: string;
    declare carrito_id: string;
    declare inventario_id: string;
    declare cantidad: number;
    declare inventario?: Inventario;
}

CarritoItem.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        carrito_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'carrito',
                key: 'id'
            }
        },
        inventario_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'inventario',
                key: 'id'
            }
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1
            }
        }
    },
    {
        sequelize,
        tableName: 'carrito_items',
        timestamps: false,
    }
);

Carrito.hasMany(CarritoItem, { foreignKey: 'carrito_id', as: 'items' });
CarritoItem.belongsTo(Carrito, { foreignKey: 'carrito_id', as: 'carrito' });

Inventario.hasMany(CarritoItem, { foreignKey: 'inventario_id', as: 'carrito_items' });
CarritoItem.belongsTo(Inventario, { foreignKey: 'inventario_id', as: 'inventario' });
