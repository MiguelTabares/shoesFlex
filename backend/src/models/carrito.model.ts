import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { EstadoCarrito, Carrito as ICarrito } from './types';
import { Usuario } from './usuario.model';
import { CarritoItem } from './carrito-item.model';

export class Carrito extends Model<ICarrito> implements ICarrito {
    declare id: string;
    declare usuario_id: string;
    declare estado: EstadoCarrito;
    declare readonly creado_en: Date;
    declare readonly actualizado_en: Date;
    declare items?: CarritoItem[];
}

Carrito.init(
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
                model: 'usuarios',
                key: 'id'
            }
        },
        estado: {
            type: DataTypes.ENUM(...Object.values(EstadoCarrito)),
            defaultValue: EstadoCarrito.ACTIVO,
            allowNull: false,
        },
        creado_en: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        actualizado_en: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'carrito',
        timestamps: true,
        createdAt: 'creado_en',
        updatedAt: 'actualizado_en'
    }
);

Usuario.hasMany(Carrito, { foreignKey: 'usuario_id', as: 'carritos' });
Carrito.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
