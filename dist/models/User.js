import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/Sequelize.js";
export class User extends Model {
}
User.init({
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
}, {
    sequelize,
    tableName: 'users',
    timestamps: true, // adds createdAt and updatedAt
});
//# sourceMappingURL=User.js.map