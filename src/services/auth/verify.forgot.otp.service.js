import AdminModel from "../../model/admin.model.js";

const verifyForgotOtpService = async ({ email, otp }) => {
  // ==========================================
  // FIND ADMIN
  // ==========================================

  const admin = await AdminModel.findOne({ email }).select(
    "+resetOtp +resetOtpExpire +isOtpVerified",
  );

  if (!admin) {
    throw new Error("Admin not found.");
  }

  // ==========================================
  // CHECK OTP EXISTS
  // ==========================================

  if (!admin.resetOtp) {
    throw new Error("Please request a new OTP.");
  }

  // ==========================================
  // CHECK OTP
  // ==========================================

  if (admin.resetOtp !== otp) {
    throw new Error("Invalid OTP.");
  }

  // ==========================================
  // CHECK OTP EXPIRY
  // ==========================================

  if (admin.resetOtpExpire < new Date()) {
    throw new Error("OTP has expired.");
  }

  // ==========================================
  // OTP VERIFIED
  // ==========================================

  admin.isOtpVerified = true;

  await admin.save();

  return {
    success: true,
    message: "OTP verified successfully.",
  };
};

export default verifyForgotOtpService;
