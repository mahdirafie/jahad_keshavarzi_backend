import { TractorLog } from '../models/TractorLog.js';
export class FakeDataGenerator {
    static async generateTractorLogs(tractorId, daysBack = 365) {
        const logs = [];
        const now = new Date();
        // Base coordinates (somewhere in Iran)
        const baseLat = 35.6892;
        const baseLng = 51.3890;
        // Generate data for each day going backwards
        for (let day = daysBack; day >= 0; day--) {
            const currentDate = new Date(now);
            currentDate.setDate(currentDate.getDate() - day);
            // Generate 24-48 logs per day (1 every 30-60 minutes)
            const logsPerDay = 24 + Math.floor(Math.random() * 25);
            for (let hour = 0; hour < 24; hour++) {
                // Skip some hours randomly to make data more realistic
                if (Math.random() > 0.7)
                    continue;
                const logTime = new Date(currentDate);
                logTime.setHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
                // Create slight variations in coordinates to simulate movement
                const latVariation = (Math.random() - 0.5) * 0.01;
                const lngVariation = (Math.random() - 0.5) * 0.01;
                // Seasonal temperature variations
                const month = logTime.getMonth();
                const baseTemp = 20 + (Math.sin((month - 6) * Math.PI / 6) * 15); // 5-35°C range
                const log = {
                    tractor_id: tractorId,
                    sent_at: logTime,
                    latitude: baseLat + latVariation,
                    longitude: baseLng + lngVariation,
                    in_fuel: Math.random() * 10 + 5, // 5-15 liters
                    out_fuel: Math.random() * 8 + 3, // 3-11 liters
                    rpm: Math.floor(Math.random() * 2000) + 500, // 500-2500 RPM
                    distance: Math.random() * 50 + 10, // 10-60 km
                    cell_signal: Math.floor(Math.random() * 5) + 1, // 1-5 bars
                    temp: baseTemp + (Math.random() - 0.5) * 10, // Base temp ±5°C
                    retry_count: Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0, // 0-2 retries, mostly 0
                    packet_day: logTime.getDate().toString().padStart(2, '0'),
                    packet_hour: logTime.getHours().toString().padStart(2, '0'),
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                logs.push(log);
                // Stop if we've reached the desired logs per day
                if (logs.length >= (day * logsPerDay) + logsPerDay)
                    break;
            }
        }
        // Insert in batches to avoid memory issues
        const batchSize = 1000;
        for (let i = 0; i < logs.length; i += batchSize) {
            const batch = logs.slice(i, i + batchSize);
            await TractorLog.bulkCreate(batch);
            console.log(`Inserted batch ${i / batchSize + 1}`);
        }
        return logs.length;
    }
    // Generate data for multiple tractors
    static async generateDataForAllTractors(tractorIds) {
        for (const tractorId of tractorIds) {
            console.log(`Generating data for tractor ${tractorId}...`);
            const count = await this.generateTractorLogs(tractorId, 365);
            console.log(`Generated ${count} logs for tractor ${tractorId}`);
        }
    }
    // Quick data generator for testing specific time ranges
    static async generateRecentData(tractorId) {
        const now = new Date();
        const logs = [];
        // Generate data for last 7 days with more density
        for (let day = 0; day < 7; day++) {
            const currentDate = new Date(now);
            currentDate.setDate(currentDate.getDate() - day);
            // More logs for recent days (every 15-30 minutes)
            for (let hour = 0; hour < 24; hour++) {
                for (let minute = 0; minute < 60; minute += 15 + Math.floor(Math.random() * 16)) {
                    const logTime = new Date(currentDate);
                    logTime.setHours(hour, minute, Math.floor(Math.random() * 60));
                    const log = {
                        tractor_id: tractorId,
                        sent_at: logTime,
                        latitude: 35.6892 + (Math.random() - 0.5) * 0.01,
                        longitude: 51.3890 + (Math.random() - 0.5) * 0.01,
                        in_fuel: Math.random() * 10 + 5,
                        out_fuel: Math.random() * 8 + 3,
                        rpm: Math.floor(Math.random() * 2000) + 500,
                        distance: Math.random() * 50 + 10,
                        cell_signal: Math.floor(Math.random() * 5) + 1,
                        temp: 25 + (Math.random() - 0.5) * 10,
                        retry_count: Math.random() > 0.95 ? 1 : 0,
                        packet_day: logTime.getDate().toString().padStart(2, '0'),
                        packet_hour: logTime.getHours().toString().padStart(2, '0'),
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    logs.push(log);
                }
            }
        }
        await TractorLog.bulkCreate(logs);
        return logs.length;
    }
}
//# sourceMappingURL=FakeDataGenerator.js.map