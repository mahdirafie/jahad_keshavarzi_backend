import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/Sequelize.js';

export class OTP extends Model {
  declare id: number;
  declare created_at: Date;
  declare status: 'verified' | 'not-verified';
  declare code: string;
  declare efforts_remained: number;
}

OTP.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('verified', 'not-verified'),
      allowNull: false,
      defaultValue: 'not-verified',
    },
    code: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    efforts_remained: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 3,
    },
  },
  {
    sequelize,
    tableName: 'otps',
    timestamps: false,
  }
);
