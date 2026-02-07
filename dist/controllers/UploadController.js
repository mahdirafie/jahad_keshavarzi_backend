import multer from "multer";
import path from "path";
import fs from "fs";
import { User } from "../models/User.js";
// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/profile-images/";
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const userId = req.user?.national_code;
        const timestamp = Date.now();
        const ext = path.extname(file.originalname).toLowerCase();
        const filename = `user-${userId}-${timestamp}${ext}`;
        cb(null, filename);
    },
});
// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error("فقط فایل‌های تصویر (JPEG, PNG, GIF) مجاز هستند"));
    }
};
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: fileFilter,
}).single("profile_image");
export class UploadController {
    static async uploadProfileImage(req, res) {
        try {
            const national_code = req.user?.national_code;
            if (!national_code) {
                return res.status(401).json({
                    success: false,
                    message: "کاربر احراز هویت نشده است",
                });
            }
            // Find user
            const user = await User.findByPk(national_code);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "کاربر یافت نشد",
                });
            }
            // Upload file
            upload(req, res, async (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === "LIMIT_FILE_SIZE") {
                            return res.status(400).json({
                                success: false,
                                message: "حجم فایل نباید بیشتر از ۲ مگابایت باشد",
                            });
                        }
                    }
                    return res.status(400).json({
                        success: false,
                        message: err.message || "خطا در آپلود فایل",
                    });
                }
                if (!req.file || !req.file.filename) {
                    return res.status(400).json({
                        success: false,
                        message: "لطفا یک فایل انتخاب کنید",
                    });
                }
                // Use forward slash for web path
                const filePath = `/uploads/profile-images/${req.file.filename}`;
                console.log("=== UPLOAD DEBUG INFO ===");
                console.log("File uploaded successfully to disk:", req.file.path);
                console.log("File name:", req.file.filename);
                console.log("File size:", req.file.size);
                console.log("File type:", req.file.mimetype);
                console.log("Web accessible path to return:", filePath);
                console.log("=========================");
                try {
                    // Delete old image if exists
                    if (user.profile_image) {
                        // Extract filename from path
                        const oldFilename = user.profile_image.split("/").pop();
                        if (oldFilename) {
                            const oldImagePath = path.join("uploads", "profile-images", oldFilename);
                            console.log("Old image filename:", oldFilename);
                            console.log("Old image full path:", oldImagePath);
                            if (fs.existsSync(oldImagePath)) {
                                fs.unlinkSync(oldImagePath);
                                console.log("Old image deleted successfully");
                            }
                        }
                    }
                    // Update user with new image path
                    const updatedUser = await user.update({
                        profile_image: filePath,
                    }, {
                        returning: true,
                    });
                    console.log("Database updated successfully");
                    console.log("User profile_image in DB:", updatedUser.profile_image);
                    return res.status(200).json({
                        success: true,
                        message: "تصویر با موفقیت آپلود شد",
                        profile_image: filePath,
                    });
                }
                catch (updateError) {
                    console.error("Error updating user:", updateError);
                    // If update fails, delete the uploaded file
                    if (req.file && req.file.path) {
                        fs.unlinkSync(req.file.path);
                        console.log("Uploaded file deleted due to update error");
                    }
                    return res.status(500).json({
                        success: false,
                        message: "خطا در به‌روزرسانی اطلاعات کاربر",
                    });
                }
            });
        }
        catch (error) {
            console.error("Server error:", error);
            return res.status(500).json({
                success: false,
                message: "خطای داخلی سرور",
            });
        }
    }
    static async deleteProfileImage(req, res) {
        try {
            const national_code = req.user?.national_code;
            if (!national_code) {
                return res.status(401).json({
                    success: false,
                    message: "کاربر احراز هویت نشده است",
                });
            }
            const user = await User.findByPk(national_code);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "کاربر یافت نشد",
                });
            }
            if (user.profile_image) {
                // Extract filename from path
                const filename = user.profile_image.split("/").pop();
                if (filename) {
                    const imagePath = path.join("uploads", "profile-images", filename);
                    console.log("Deleting image at:", imagePath);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log("Image deleted successfully");
                    }
                }
                await user.update({ profile_image: null });
                console.log("User profile_image set to null");
            }
            return res.status(200).json({
                success: true,
                message: "تصویر پروفایل حذف شد",
            });
        }
        catch (error) {
            console.error("Error deleting image:", error);
            return res.status(500).json({
                success: false,
                message: "خطای داخلی سرور",
            });
        }
    }
}
//# sourceMappingURL=UploadController.js.map