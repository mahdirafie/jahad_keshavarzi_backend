// utils/userValidation.ts
import { User } from "../models/User.js";

export function ensureProfileComplete(user: User) {
  // List of nullable fields that must be filled to consider the profile "complete"
  const requiredFields: (keyof User)[] = [
    "postal_code",
    "landline_phone",
    "address",
    "province",
    "city"
  ];

  const incompleteFields = requiredFields.filter(field => user[field] == null);

  if (incompleteFields.length > 0) {
    throw new Error(
      `پروفایل کامل نیست! لطفا به بخش پروفایل رفته و تمام فیلد های ضروری را پر کنید.`
    );
  }

  return true; // profile is complete
}
