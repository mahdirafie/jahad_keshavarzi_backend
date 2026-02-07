import express from 'express';
import type { Request, Response } from 'express';

// Import Sequelize instance and models (use .js for ESM)
import sequelize from './config/Sequelize.js';
import { User } from './models/User.js';
import { Tractor } from './models/Tractor.js';
import { TractorLog } from './models/TractorLog.js';
import { Product } from "./models/Product.js";

import TractorLogRoutes from "./routes/TractorLogRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import TractorRoutes from "./routes/TractorRoutes.js";
import OTPRoutes from "./routes/OTPRoutes.js";
import ProductRoutes from "./routes/ProductRoutes.js";
import PaymentRoutes from "./routes/PaymentRoutes.js";

import { setupSwagger } from './swagger.js';

import cors from "cors";
import { FakeDataGenerator } from './data_generator/FakeDataGenerator.js';
import { UserController } from './controllers/UserController.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 4000;

app.use(cors());

app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


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
// Development Route to Generate Fake Data
// -------------------------

app.post('/dev/generate_fake_data', async (req: Request, res: Response) => {
  try {
    const { tractor_id, days = 365 } = req.body;
    
    if (!tractor_id) {
      return res.status(400).json({ error: 'tractorId is required' });
    }

    // Check if tractor exists
    const tractor = await Tractor.findByPk(tractor_id);
    if (!tractor) {
      return res.status(404).json({ error: 'Tractor not found' });
    }

    console.log(`Generating fake data for tractor ${tractor_id}...`);
    const count = await FakeDataGenerator.generateTractorLogs(tractor_id, days);
    
    res.json({
      message: `Successfully generated ${count} logs for tractor ${tractor_id}`,
      tractor_id,
      days,
      logCount: count
    });
  } catch (error) {
    console.error('Error generating fake data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear fake data route (optional)
app.delete('/dev/clear-fake-data/:tractor_id', async (req: Request, res: Response) => {
  try {
    const { tractor_id } = req.params;
    
    const deletedCount = await TractorLog.destroy({
      where: { tractor_id: tractor_id }
    });
    
    res.json({
      message: `Cleared ${deletedCount} logs for tractor ${tractor_id}`,
      deletedCount
    });
  } catch (error) {
    console.error('Error clearing fake data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------------------
// Routes
// -------------------------

app.use('/tractor_log', TractorLogRoutes);
app.use('/user', UserRoutes);
app.use('/tractor', TractorRoutes);
app.use('/otp', OTPRoutes);
app.use('/product', ProductRoutes);
app.use('/payment', PaymentRoutes);

app.get('/', (req: Request, res: Response) => {
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
    await sequelize.sync({force: false});
    console.log('✅ Models synced!');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
})();

// -------------------------
// Start server
// -------------------------

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
