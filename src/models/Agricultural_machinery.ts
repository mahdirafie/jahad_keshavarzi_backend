import { DataTypes, ForeignKey, Model } from "sequelize";
import { PerformanceClass } from "../types/performanceClass";
import { User } from "./User";
import sequelize from "../config/Sequelize";

export class AgriculturalMachinery extends Model {
  declare id: number;
  declare manufactureYear: number;
  declare model: string;
  declare owner_id: ForeignKey<User["national_code"]>;

  declare chasis_number: string | null;
  declare engine_number: string | null;
  declare plate_number: string | null;
  declare performance_class: PerformanceClass | null;

  declare createdAt?: Date;
  declare updatedAt?: Date;
}

AgriculturalMachinery.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    manufactureYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "national_code",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    chassis_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    engine_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    plate_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    performance_class: {
      type: DataTypes.ENUM,
      allowNull: true,
    },
  },
  { sequelize, tableName: "agricultural_machineries", timestamps: true }
);
