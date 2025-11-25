import { DataTypes, ForeignKey, Model } from "sequelize";
import sequelize from "../config/Sequelize.js";
import { User } from "./User.js";

export class Tractor extends Model {
  declare id: number;
  declare model: string;
  declare national_code: ForeignKey<User["national_code"]>;
  declare power: number | null;
  declare cylinder_no: number | null;
  declare product_year: string;

  declare owner?: User;
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
        model: "users",
        key: "national_code",
      },
      onDelete: 'CASCADE'
    },
    power: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    cylinder_no: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    production_year: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "tractors",
    timestamps: true,
  }
);
