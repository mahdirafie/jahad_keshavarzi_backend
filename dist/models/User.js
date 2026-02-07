import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/Sequelize.js";
export class User extends Model {
}
User.init({
    national_code: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    father_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    village: {
        type: DataTypes.STRING,
        allowNull: true
    },
    birth_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    ownership_type: {
        type: DataTypes.ENUM('personal', 'professional'),
        allowNull: true
    },
    profile_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    province: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
});
//# sourceMappingURL=User.js.map