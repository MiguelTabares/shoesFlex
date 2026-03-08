import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { ItemPedido as IItemPedido } from './types';
import { Pedido } from './pedido.model';
import { Inventario } from './inventario.model';

export class ItemPedido extends Model<IItemPedido> implements IItemPedido {
    declare id: string;
    declare pedido_id: string;
    declare inventario_id: string;
    declare cantidad: number;
    declare precio_unitario: number;

    // Virtual or Includes
    declare inventario?: Inventario;
}

ItemPedido.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        pedido_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'pedidos',
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
            validate: { min: 1 }
        },
        precio_unitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        }
    },
    {
        sequelize,
        tableName: 'items_pedido',
        timestamps: false,
    }
);

Pedido.hasMany(ItemPedido, { foreignKey: 'pedido_id', as: 'items' });
ItemPedido.belongsTo(Pedido, { foreignKey: 'pedido_id', as: 'pedido' });

Inventario.hasMany(ItemPedido, { foreignKey: 'inventario_id', as: 'items_pedido' });
ItemPedido.belongsTo(Inventario, { foreignKey: 'inventario_id', as: 'inventario' });
