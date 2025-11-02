import { Association, DataTypes, Model } from 'sequelize';
import sequelize from "../db/Sequelize.js"
import { Tractor } from './Tractor.js';

export class User extends Model {
  declare national_code: string;
  declare name: string;
  declare phone: string;
  declare password: string;

  declare tractors?: Tractor[];
  static associations: {
    tractors: Association<User, Tractor>;
  };
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
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true, // adds createdAt and updatedAt
  }
);
