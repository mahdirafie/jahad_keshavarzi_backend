import { Model, DataTypes } from "sequelize";
import sequelize from "../config/Sequelize.js";
export class Product extends Model {
}
Product.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    }
}, { sequelize, tableName: 'products', timestamps: true });
//# sourceMappingURL=Product.js.map