import { Model, DataTypes } from "sequelize";
import sequelize from "../config/Sequelize.js";

export class Product extends Model {
    declare id: number;
    declare name: string;
    declare price: number;

    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
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
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
    }
}, {sequelize, tableName: 'products', timestamps: true});