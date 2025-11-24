import { Association, DataTypes, Model, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from "../config/Sequelize.js"
import { Tractor } from './Tractor.js';

export class User extends Model {
  declare national_code: string;
  declare name: string;
  declare phone: string;
  declare password: string;
  declare postal_code: string | null;
  declare landline_phone: string | null;
  declare address: string | null;
  declare province: string | null;
  declare city: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // association mixin methods
  declare getTractors: HasManyGetAssociationsMixin<Tractor>;
}

User.init(
  {
    national_code: {
      type: DataTypes.STRING(10), // Iranian national code is 10 digits
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(11), // Iranian phone numbers are 11 digits
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    landline_phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    province: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);
