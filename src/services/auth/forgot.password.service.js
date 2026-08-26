import AdminModel from "../../model/admin.model.js";
import generateOTP from "../../utils/generateOTP.js";
import sendResetOTP from "../../utils/sendResetOTP.js";


const forgotPasswordService = async (email) => {
  // ==========================================
  // CHECK EMAIL
  // ==========================================

  const admin = await AdminModel.findOne({ email }).select(
    "+resetOtp +resetOtpExpire +isOtpVerified",
  );

  if (!admin) {
    throw new Error("Admin not found.");
  }

  // ==========================================
  // GENERATE OTP
  // ==========================================

  const otp = generateOTP();

  // ==========================================
  // SAVE OTP
  // ==========================================

  admin.resetOtp = otp;

  admin.resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000);

  admin.isOtpVerified = false;

  await admin.save();

  // ==========================================
  // SEND EMAIL
  // ==========================================

  await sendResetOTP({
    email: admin.email,
    name: admin.name,
    otp,
  });

  return {
    success: true,
    message: "OTP sent successfully to your email.",
  };
};

export default forgotPasswordService;
