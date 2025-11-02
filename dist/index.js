import express from 'express';
// Import Sequelize instance and models (use .js for ESM)
import sequelize from './db/Sequelize.js';
import { User } from './models/User.js';
import { Tractor } from './models/Tractor.js';
import { TractorLog } from './models/TractorLog.js';
import TractorLogRoutes from "./routes/TractorLogRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import TractorRoutes from "./routes/TractorRoutes.js";
import { setupSwagger } from './swagger.js';
import cors from "cors";
const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());
setupSwagger(app);
// -------------------------
// Define associations
// -------------------------
// User -> Tractor
User.hasMany(Tractor, { foreignKey: 'national_code', as: "tractors" });
Tractor.belongsTo(User, { foreignKey: 'national_code', as: "owner" });
// Tractor -> TractorLog
Tractor.hasMany(TractorLog, { foreignKey: 'tractor_id' });
TractorLog.belongsTo(Tractor, { foreignKey: 'tractor_id' });
// -------------------------
// Routes
// -------------------------
app.use('/tractor_log', TractorLogRoutes);
app.use('/user', UserRoutes);
app.use('/tractor', TractorRoutes);
app.get('/', (req, res) => {
    res.send('Hello, TypeScript + Node.js backend with Sequelize!');
});
// -------------------------
// Connect to DB and sync models
// -------------------------
(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected!');
        // Sync all models
        await sequelize.sync({ alter: true }); // use { force: true } to drop & recreate tables
        console.log('✅ Models synced!');
        // Optional: create a test user
        // await User.create({ national_code: '1234567890', name: 'Ali', phone: '09123456789' });
    }
    catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
})();
// -------------------------
// Start server
// -------------------------
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map