import { DataTypes, ForeignKey, Model } from 'sequelize';
import sequelize from '../config/Sequelize.js';
import { User } from './User.js';

export class Tractor extends Model {
  declare id: number;
  declare model: string;
  declare national_code: ForeignKey<User['national_code']>; // foreign key to User
  declare city: string;
}

Tractor.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    national_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'users',
        key: 'national_code'
      }
    },
    city: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "اراک"
    }
  },
  {
    sequelize,
    tableName: 'tractors',
    timestamps: true,
  }
);
