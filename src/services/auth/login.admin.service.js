import AdminModel from "../../model/admin.model.js";
import ApiError from "../../utils/ApiError.js";
import generateAccessToken from "../../utils/generateAccessToken.js";
import generateRefreshToken from "../../utils/generateRefreshToken.js";


const loginAdminService = async ({ email, password, req }) => {
  // ======================================
  // FIND ADMIN
  // ======================================

  const admin = await AdminModel.findOne({
    email,
  }).select("+password +refreshToken");

  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  // ======================================
  // ACCOUNT STATUS CHECK
  // ======================================

  if (!admin.isActive) {
    throw new ApiError(403, "Account is inactive");
  }

  if (admin.isBlocked) {
    throw new ApiError(403, "Account is blocked");
  }

  // ======================================
  // PASSWORD CHECK
  // ======================================

  const isPasswordCorrect = await admin.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  // ======================================
  // GENERATE TOKENS
  // ======================================

  const accessToken = generateAccessToken(admin);

  const refreshToken = generateRefreshToken(admin);

  // ======================================
  // SAVE REFRESH TOKEN
  // ======================================

  admin.refreshToken = refreshToken;

  // ======================================
  // UPDATE LOGIN DETAILS
  // ======================================

  admin.lastLogin = new Date();
  admin.lastLoginIP = req.ip;

  await admin.save();



  return {
    admin,
    accessToken,
    refreshToken,
  };
};

export default loginAdminService;
