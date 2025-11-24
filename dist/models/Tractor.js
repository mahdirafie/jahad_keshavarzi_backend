import { DataTypes, Model } from "sequelize";
import sequelize from "../config/Sequelize.js";
export class Tractor extends Model {
}
Tractor.init({
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
    },
    power: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    cylinder_no: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: "tractors",
    timestamps: true,
});
//# sourceMappingURL=Tractor.js.map