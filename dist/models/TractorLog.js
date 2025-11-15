import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/Sequelize.js';
export class TractorLog extends Model {
}
TractorLog.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    tractor_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'tractors',
            key: 'id'
        }
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
    packet_day: {
        type: DataTypes.STRING(2),
        allowNull: true,
    },
    packet_hour: {
        type: DataTypes.STRING(2),
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'tractor_logs',
    timestamps: true,
});
//# sourceMappingURL=TractorLog.js.map