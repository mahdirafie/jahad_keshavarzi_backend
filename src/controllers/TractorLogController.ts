import { Request, Response } from "express";
import { TractorLog } from "../models/TractorLog.js";
import { Tractor } from "../models/Tractor.js";
import { Op } from "sequelize";

export class TractorLogController {
  /**
   * Create a new tractor log (POST method only)
   * Handles device-formatted body and returns plain text responses.
   */
  static async createTractorLog(req: Request, res: Response) {
    try {
      // Validate JSON structure
      if (!req.body || typeof req.body !== "object") {
        return res
          .status(400)
          .type("text")
          .send("RECEIVED:\nInvalid JSON\nFAIL");
      }

      const {
        pass,
        tractor_id,
        sent_at,
        lat,
        lon,
        distance,
        in_fuel,
        out_fuel,
        rpm,
        cell_signal,
        temp,
        retry_count,
      } = req.body;

      // Password check
      if (pass !== "123456") {
        return res
          .status(403)
          .type("text")
          .send("RECEIVED:\nACCESS DENIED\nFAIL");
      }

      // Basic validation for required fields
      if (
        !tractor_id ||
        !sent_at ||
        lat === undefined ||
        lon === undefined ||
        rpm === undefined
      ) {
        return res
          .status(400)
          .type("text")
          .send("RECEIVED:\nInvalid JSON\nFAIL");
      }

      // Check if tractor exists
      const tractor = await Tractor.findByPk(tractor_id);
      if (!tractor) {
        return res
          .status(404)
          .type("text")
          .send("RECEIVED:\nInvalid JSON\nFAIL");
      }

      // Convert sent_at (UNIX timestamp string) → Date
      const sentAtDate = new Date(Number(sent_at) * 1000);

      // Create log
      await TractorLog.create({
        tractor_id,
        sent_at: sentAtDate,
        latitude: lat,
        longitude: lon,
        distance,
        in_fuel,
        out_fuel,
        rpm,
        cell_signal,
        temp,
        retry_count,
      });

      return res.status(200).type("text").send("RECEIVED:\nSAVED\nSUCCESS");
    } catch (error) {
      console.error(error);
      return res.status(500).type("text").send("RECEIVED:\nInvalid JSON\nFAIL");
    }
  }

  static async getAllLogsForTractor(req: Request, res: Response) {
    try {
      // Validate body
      if (!req.body || typeof req.body !== "object") {
        return res.status(400).json({ message: "Invalid request body" });
      }

      const { tractor_id } = req.body;

      // Check for missing tractor_id
      if (!tractor_id) {
        return res.status(400).json({ message: "Missing tractor_id" });
      }

      // Check if tractor exists
      const tractor = await Tractor.findByPk(tractor_id);
      if (!tractor) {
        return res.status(404).json({ message: "No tractor found with this ID" });
      }

      // Calculate timestamp for 24 hours ago
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      // Fetch only logs from the last 24 hours
      const logs = await TractorLog.findAll({
        where: {
          tractor_id,
          sent_at: {
            [Op.gte]: twentyFourHoursAgo,
          },
        },
        order: [["sent_at", "DESC"]],
      });

      // Handle no logs
      if (!logs.length) {
        return res.status(200).json({
          message: "هیچ اطلاعاتی در ۲۴ ساعت گذشته برای این تراکتور وجود ندارد!",
          tractor,
          logs: [],
        });
      }

      // Success
      return res.status(200).json({
        message: "Logs from last 24 hours retrieved successfully",
        tractor,
        logs,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
