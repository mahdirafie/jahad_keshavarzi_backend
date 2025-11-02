import { Sequelize } from 'sequelize';
// Update these with your DB credentials
const sequelize = new Sequelize('jahad_db', 'rafi', 'rafidb', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log,
});
export default sequelize;
//# sourceMappingURL=Sequelize.js.map