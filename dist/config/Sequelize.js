import { Sequelize } from 'sequelize';
const sequelize = new Sequelize('jahad_db', 'rafi', 'rafidb', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
    timezone: '+00:00',
    dialectOptions: {
        timezone: '+00:00',
    },
});
export default sequelize;
//# sourceMappingURL=Sequelize.js.map