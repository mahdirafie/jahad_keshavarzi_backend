import https from "https";
import { Request, Response } from "express";

const MERCHANT_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
// const CALLBACK_URL = "https://peymash.ir/verify-payment";
const CALLBACK_URL = "http://localhost:3000/verify-payment";

export class PaymentController {
  static async requestPayment(req: Request, res: Response): Promise<void> {
    try {
      const { amount, email } = req.body;
      const mobile = (req as any).userph;

      const requestBody = JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount,
        callback_url: CALLBACK_URL,
        description: "پرداخت سفارش",
        metadata: {
          mobile,
          email: email || "vida.shop1399@gmail.com",
        },
      });

      const options = {
        hostname: "sandbox.zarinpal.com",
        port: 443,
        path: "/pg/v4/payment/request.json",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      };

      const zarinReq = https.request(options, (zarinRes) => {
        let data = "";

        zarinRes.on("data", (chunk) => (data += chunk));

        zarinRes.on("end", () => {
          try {
            res.status(200).json(JSON.parse(data));
          } catch {
            res.status(500).json({
              data: null,
              errors: ["Error parsing Zarinpal response"],
            });
          }
        });
      });

      zarinReq.on("error", (error) => {
        console.error("Payment Request Error:", error);
        res.status(500).json({
          data: null,
          errors: [error.message],
        });
      });

      zarinReq.write(requestBody);
      zarinReq.end();
    } catch (error: any) {
      res.status(500).json({
        data: null,
        errors: [error.message],
      });
    }
  }

  static async verifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { amount, authority } = req.body;

      const requestBody = JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount,
        authority,
      });

      const options = {
        hostname: "sandbox.zarinpal.com",
        port: 443,
        path: "/pg/v4/payment/verify.json",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Content-Length": Buffer.byteLength(requestBody),
        },
      };

      const zarinReq = https.request(options, (zarinRes) => {
        let data = "";

        zarinRes.on("data", (chunk) => (data += chunk));

        zarinRes.on("end", () => {
          try {
            res.status(200).json(JSON.parse(data));
          } catch {
            res.status(500).json({
              data: null,
              errors: ["Error parsing Zarinpal response"],
            });
          }
        });
      });

      zarinReq.on("error", (error) => {
        console.error("Payment Verification Error:", error);
        res.status(500).json({
          data: null,
          errors: [error.message],
        });
      });

      zarinReq.write(requestBody);
      zarinReq.end();
    } catch (error: any) {
      res.status(500).json({
        data: null,
        errors: [error.message],
      });
    }
  }
}
