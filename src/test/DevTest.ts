import { OTPController } from "../controllers/OTPController.js";

// sendOTP test:
// const mockReq = {
//   body: {
//     phone: "09188931775"
//   }
// } as any;

// const mockRes = {
//   json(data: any) {
//     console.log("Response:", data);
//   },
//   status(code: number) {
//     console.log("Status:", code);
//     return this;
//   }
// } as any;

// UserController.sendOTP(mockReq, mockRes);

// verifyOTP test:
const mockReq = {
  body: {
    phone: "09188931775",
    code: "938622"
  }
} as any;

const mockRes = {
  json(data: any) {
    console.log("Response:", data);
  },
  status(code: number) {
    console.log("Status:", code);
    return this;
  }
} as any;

OTPController.verifyOTP(mockReq, mockRes);