import AdminModel from "../../model/admin.model.js";

const resetPasswordService = async ({
  email,
  newPassword,
  confirmPassword,
}) => {
  // ==========================================
  // FIND ADMIN
  // ==========================================

  const admin = await AdminModel.findOne({ email }).select(
    "+password +isOtpVerified +resetOtp +resetOtpExpire",
  );

  if (!admin) {
    throw new Error("Admin not found.");
  }

  // ==========================================
  // OTP VERIFIED?
  // ==========================================

  if (!admin.isOtpVerified) {
    throw new Error("Please verify OTP first.");
  }

  // ==========================================
  // PASSWORD MATCH
  // ==========================================

  if (newPassword !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  // ==========================================
  // CHECK OLD PASSWORD
  // ==========================================

  const isSamePassword = await admin.comparePassword(newPassword);

  if (isSamePassword) {
    throw new Error("New password cannot be same as old password.");
  }

  // ==========================================
  // SAVE PASSWORD
  // ==========================================

  admin.password = newPassword;

  admin.passwordChangedAt = new Date();

  // ==========================================
  // CLEAR OTP
  // ==========================================

  admin.resetOtp = null;

  admin.resetOtpExpire = null;

  admin.isOtpVerified = false;

  // ==========================================
  // LOGOUT ALL DEVICES
  // ==========================================

  admin.tokenVersion += 1;

  await admin.save();

  return {
    success: true,
    message: "Password reset successfully.",
  };
};

export default resetPasswordService;
