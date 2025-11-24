import { Model, DataTypes, ForeignKey } from "sequelize";
import sequelize from "../config/Sequelize";
import { User } from "./User";

class Order extends Model {
    declare address: string;
    declare postal_code: string;
    declare national_code: ForeignKey<User['national_code']>;

    declare readonly createdAt: Date;
};