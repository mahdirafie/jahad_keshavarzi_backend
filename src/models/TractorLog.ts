import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/Sequelize.js';

export class TractorLog extends Model {
  declare id: number;
  declare tractor_id: number;
  declare sent_at: Date;
  declare latitude: number;
  declare longitude: number;
  declare in_fuel: number;
  declare out_fuel: number;
  declare rpm: number;
  declare distance: number;
  declare cell_signal: number;
  declare temp: number;
  declare retry_count: number;
}

TractorLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tractor_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    in_fuel: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    out_fuel: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    rpm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    distance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cell_signal: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    temp: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    retry_count: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'tractor_logs',
    timestamps: true,
    createdAt: false
  }
);
