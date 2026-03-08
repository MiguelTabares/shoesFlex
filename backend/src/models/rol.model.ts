import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Rol extends Model {
    declare id: string;
    declare nombre: string;
}

Rol.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        }
    },
    {
        sequelize,
        tableName: 'roles',
        timestamps: false,
    }
);
