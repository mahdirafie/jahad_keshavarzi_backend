import { Request, Response } from "express";
import { TractorLog } from "../models/TractorLog.js";
import { Tractor } from "../models/Tractor.js";
import { col, fn, Op } from "sequelize";
import moment from "moment-timezone";
import moment_jalali from "moment-jalaali";

// Persian day names mapping
const PERSIAN_DAYS: { [key: string]: string } = {
  Saturday: "شنبه",
  Sunday: "یکشنبه",
  Monday: "دوشنبه",
  Tuesday: "سه‌شنبه",
  Wednesday: "چهارشنبه",
  Thursday: "پنج‌شنبه",
  Friday: "جمعه",
};

export class TractorLogController {
  /**
   * Create a new tractor log (POST method only)
   * Handles device-formatted body and returns plain text responses.
   */
  static async createTractorLog(req: Request, res: Response) {
    try {
      // Ensure JSON body is valid
      if (!req.body || typeof req.body !== "object") {
        return res
          .status(400)
          .type("text")
          .send("RECEIVED:\nInvalid JSON\nFAIL");
      }

      // Handle both single object and array
      const logs = Array.isArray(req.body) ? req.body : [req.body];

      for (const log of logs) {
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
          packet_day,
          packet_hour,
        } = log;

        // Password check
        if (pass !== "123456") {
          return res
            .status(403)
            .type("text")
            .send("RECEIVED:\nACCESS DENIED\nFAIL");
        }

        // Basic validation
        if (
          !tractor_id ||
          !sent_at ||
          lat === undefined ||
          lon === undefined ||
          rpm === undefined ||
          in_fuel === undefined ||
          out_fuel === undefined ||
          packet_day === undefined ||
          packet_hour === undefined
        ) {
          return res
            .status(400)
            .type("text")
            .send("RECEIVED:\nInvalid JSON\nFAIL");
        }

        // Ensure tractor exists
        const tractor = await Tractor.findByPk(tractor_id);
        if (!tractor) {
          return res
            .status(404)
            .type("text")
            .send("RECEIVED:\nInvalid JSON\nFAIL");
        }

        // Convert Iran local time to UTC
        const sentAtDate = moment
          .tz(sent_at, "YYYY-MM-DDTHH:mm:ss", "Asia/Tehran")
          .utc()
          .toDate();
        
        if (!sentAtDate || isNaN(sentAtDate.getTime())) {
          return res
            .status(400)
            .type("text")
            .send("RECEIVED:\nInvalid date\nFAIL");
        }

        // Create log
        await TractorLog.create({
          tractor_id,
          sent_at: sentAtDate,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          distance: parseFloat(distance),
          in_fuel: parseFloat(in_fuel),
          out_fuel: parseFloat(out_fuel),
          rpm: parseInt(rpm),
          cell_signal: parseInt(cell_signal),
          temp: parseFloat(temp),
          retry_count: parseInt(retry_count),
          packet_day,
          packet_hour,
        });
      }

      return res.status(200).type("text").send("RECEIVED:\nSAVED\nSUCCESS");
    } catch (error) {
      console.error("Error saving tractor log:", error);
      return res.status(500).type("text").send("RECEIVED:\nInvalid JSON\nFAIL");
    }
  }

  static async getAllLogsForTractor(req: Request, res: Response) {
    try {
      const { tractor_id } = req.body;
      const time_range = req.query.time_range?.toString().toLowerCase() || "day";

      if (!tractor_id) {
        return res.status(400).json({ message: "Missing tractor_id" });
      }

      const tractor = await Tractor.findByPk(tractor_id);
      if (!tractor) {
        return res
          .status(404)
          .json({ message: "No tractor found with this ID" });
      }

      // Get current time in Iran timezone
      const nowIran = moment.tz("Asia/Tehran");
      const nowJalali = moment_jalali(nowIran);

      let startTimeUTC: Date;
      let endTimeUTC: Date;
      let groupByFormat: string = "%Y-%m-%d";

      switch (time_range) {
        case "day": {
          // Start of day: set time to 00:00:00
          const startOfDay = nowIran.clone().startOf("day");
          // End of day: set time to 23:59:59.999
          const endOfDay = nowIran.clone().endOf("day");
          
          startTimeUTC = startOfDay.toDate();
          endTimeUTC = endOfDay.toDate();
          groupByFormat = "%H";
          break;
        }

        case "week": {
          // Jalali week starts on Saturday (day 6 in moment.js)
          // Get the day of week (0=Sunday, 6=Saturday)
          const currentDayOfWeek = nowIran.day();
          
          // Calculate days to subtract to get to Saturday
          // If today is Saturday (6), subtract 0
          // If today is Sunday (0), subtract 1
          // If today is Monday (1), subtract 2, etc.
          const daysToSaturday = currentDayOfWeek === 6 ? 0 : (currentDayOfWeek + 1);
          
          const startOfWeek = nowIran.clone().subtract(daysToSaturday, "days").startOf("day");
          const endOfWeek = startOfWeek.clone().add(6, "days").endOf("day");
          
          startTimeUTC = startOfWeek.toDate();
          endTimeUTC = endOfWeek.toDate();
          groupByFormat = "%Y-%m-%d";
          break;
        }

        case "month": {
          const startOfMonthJalali = nowJalali.clone().startOf("jMonth");
          const endOfMonthJalali = nowJalali.clone().endOf("jMonth");
          startTimeUTC = startOfMonthJalali.toDate();
          endTimeUTC = endOfMonthJalali.toDate();
          groupByFormat = "%Y-%u";
          break;
        }

        case "year": {
          const startOfYearJalali = nowJalali.clone().startOf("jYear");
          const endOfYearJalali = nowJalali.clone().endOf("jYear");
          startTimeUTC = startOfYearJalali.toDate();
          endTimeUTC = endOfYearJalali.toDate();
          groupByFormat = "%Y-%m";
          break;
        }

        default: {
          const startOfDay = nowIran.clone().startOf("day");
          const endOfDay = nowIran.clone().endOf("day");
          startTimeUTC = startOfDay.toDate();
          endTimeUTC = endOfDay.toDate();
          break;
        }
      }

      // For "day" range, return individual logs
      if (time_range === "day") {
        const logs = await TractorLog.findAll({
          where: {
            tractor_id,
            sent_at: {
              [Op.gte]: startTimeUTC,
              [Op.lte]: endTimeUTC,
            },
          },
          order: [["sent_at", "DESC"]],
        });

        // Calculate Jalali day range for display
        const startJalali = moment_jalali(moment.tz(startTimeUTC, "Asia/Tehran"));
        const endJalali = moment_jalali(moment.tz(endTimeUTC, "Asia/Tehran"));

        return res.status(200).json({
          message: "Daily logs retrieved successfully (Jalali day range)",
          tractor,
          logs,
          jalali_range: {
            start: startJalali.format("jYYYY/jMM/jDD HH:mm:ss"),
            end: endJalali.format("jYYYY/jMM/jDD HH:mm:ss"),
          },
        });
      }

      // For other ranges, return aggregated data
      const logs = await TractorLog.findAll({
        attributes: [
          [fn("AVG", col("latitude")), "avg_lat"],
          [fn("AVG", col("longitude")), "avg_lon"],
          [fn("SUM", col("in_fuel")), "sum_in_fuel"],
          [fn("SUM", col("out_fuel")), "sum_out_fuel"],
          [fn("AVG", col("rpm")), "avg_rpm"],
          [fn("SUM", col("distance")), "sum_distance"],
          [fn("AVG", col("temp")), "avg_temp"],
          [fn("DATE_FORMAT", col("sent_at"), groupByFormat), "group_period"],
        ],
        where: {
          tractor_id,
          sent_at: {
            [Op.gte]: startTimeUTC,
            [Op.lte]: endTimeUTC,
          },
        },
        group: ["group_period"],
        order: [["group_period", "ASC"]],
        raw: true,
      });

      // Transform and localize logs
      const localizedLogs = logs.map((log: any, index: number) => {
        // Parse numeric values
        const data = {
          ...log,
          avg_lat: log.avg_lat ? parseFloat(log.avg_lat) : null,
          avg_lon: log.avg_lon ? parseFloat(log.avg_lon) : null,
          avg_rpm: log.avg_rpm ? parseFloat(log.avg_rpm) : null,
          avg_temp: log.avg_temp ? parseFloat(log.avg_temp) : null,
          sum_in_fuel: log.sum_in_fuel ? parseFloat(log.sum_in_fuel) : null,
          sum_out_fuel: log.sum_out_fuel ? parseFloat(log.sum_out_fuel) : null,
          sum_distance: log.sum_distance ? parseFloat(log.sum_distance) : null,
        };

        if (time_range === "week") {
          // Convert Gregorian date to Jalali
          const gregorianDate = moment.utc(data.group_period + "T00:00:00Z").tz("Asia/Tehran");
          const jalaliMoment = moment_jalali(gregorianDate);
          const dayNameEnglish = gregorianDate.format("dddd");
          const dayNamePersian = PERSIAN_DAYS[dayNameEnglish] || dayNameEnglish;
          
          return {
            ...data,
            day: dayNamePersian,
            jalali_date: jalaliMoment.format("jYYYY/jMM/jDD"),
          };
        } else if (time_range === "month") {
          // For month view, show week numbers
          const weekLabels = ["اول", "دوم", "سوم", "چهارم", "پنجم", "ششم"];
          const weekLabel = weekLabels[Math.min(index, 5)];
          
          return {
            ...data,
            week: `هفته ${weekLabel}`,
          };
        } else if (time_range === "year") {
          // Convert Gregorian month to Jalali month
          const [year, month] = data.group_period.split("-");
          const gregorianDate = moment.utc(`${year}-${month}-01T00:00:00Z`).tz("Asia/Tehran");
          const jalaliMoment = moment_jalali(gregorianDate);
          const monthName = jalaliMoment.format("jMMMM");
          const jalaliYear = jalaliMoment.format("jYYYY");

          return {
            ...data,
            month: monthName,
            jalali_year: jalaliYear,
          };
        }
        
        return data;
      });

      // Calculate Jalali range for response
      let jalaliRangeInfo;
      switch (time_range) {
        case "week": {
          const startJalali = moment_jalali(moment.tz(startTimeUTC, "Asia/Tehran"));
          const endJalali = moment_jalali(moment.tz(endTimeUTC, "Asia/Tehran"));
          jalaliRangeInfo = {
            start: startJalali.format("jYYYY/jMM/jDD"),
            end: endJalali.format("jYYYY/jMM/jDD"),
          };
          break;
        }
        case "month": {
          const startJalali = moment_jalali(moment.tz(startTimeUTC, "Asia/Tehran"));
          const endJalali = moment_jalali(moment.tz(endTimeUTC, "Asia/Tehran"));
          jalaliRangeInfo = {
            start: startJalali.format("jYYYY/jMM/jDD"),
            end: endJalali.format("jYYYY/jMM/jDD"),
          };
          break;
        }
        case "year": {
          const startJalali = moment_jalali(moment.tz(startTimeUTC, "Asia/Tehran"));
          const endJalali = moment_jalali(moment.tz(endTimeUTC, "Asia/Tehran"));
          jalaliRangeInfo = {
            start: startJalali.format("jYYYY/jMM/jDD"),
            end: endJalali.format("jYYYY/jMM/jDD"),
          };
          break;
        }
      }

      return res.status(200).json({
        message: `Aggregated logs retrieved for ${time_range} (Jalali range)`,
        tractor,
        logs: localizedLogs,
        jalali_range: jalaliRangeInfo,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}