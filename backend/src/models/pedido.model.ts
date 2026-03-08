import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Pedido as IPedido, EstadoPedido } from './types';
import { Usuario } from './usuario.model';

export class Pedido extends Model<IPedido> implements IPedido {
    declare id: string;
    declare usuario_id: string;
    declare total: number;
    declare estado: EstadoPedido;
    declare readonly fecha_pedido: Date;
}

Pedido.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        usuario_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'usuarios', // Table name
                key: 'id'
            }
        },
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        estado: {
            type: DataTypes.ENUM(...Object.values(EstadoPedido)),
            defaultValue: EstadoPedido.PAGADO, // Start as PAID for simulation
            allowNull: false,
        },
        fecha_pedido: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    },
    {
        sequelize,
        tableName: 'pedidos',
        timestamps: false,
    }
);

Usuario.hasMany(Pedido, { foreignKey: 'usuario_id', as: 'pedidos' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
