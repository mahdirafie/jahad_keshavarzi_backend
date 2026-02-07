import { Association, DataTypes, Model, HasManyGetAssociationsMixin } from 'sequelize';
import sequelize from "../config/Sequelize.js"
import { Tractor } from './Tractor.js';

export class User extends Model {
  declare national_code: string;
  declare name: string;
  declare phone: string;
  declare password: string;
  declare father_name: string | null;
  declare village: string | null;
  declare birth_date: Date | null;
  declare ownership_type: 'personal' | 'professional' | null;
  declare profile_image: string | null;
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
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    father_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    village: {
      type: DataTypes.STRING,
      allowNull: true
    },
    birth_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ownership_type: {
      type: DataTypes.ENUM('personal', 'professional'),
      allowNull: true
    },
    profile_image: {
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