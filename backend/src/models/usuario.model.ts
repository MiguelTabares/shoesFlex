import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import { Usuario as IUsuario, Rol as IRol } from './types';
import { Rol } from './rol.model';

export class Usuario extends Model<IUsuario> implements IUsuario {
    declare id: string;
    declare nombre: string;
    declare email: string;
    declare password_hash: string;
    declare rol_id: string;
    declare readonly fecha_registro: Date;
}

Usuario.init(
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
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        rol_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'roles',
                key: 'id'
            }
        },
        fecha_registro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'usuarios',
        timestamps: false,
    }
);

Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });
Rol.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });
