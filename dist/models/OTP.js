import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/Sequelize.js';
import { OTPStatus } from '../types/OTPStatus.js';
export class OTP extends Model {
}
OTP.init({
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
        type: DataTypes.ENUM(...Object.values(OTPStatus)),
        allowNull: false,
        defaultValue: OTPStatus.NOT_VERIFIED,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    efforts_remained: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 3,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    tableName: 'otps',
    timestamps: false,
});
//# sourceMappingURL=OTP.js.map