
import ApiError from "../../utils/ApiError.js";
import AdminModel from "../../model/admin.model.js";
import generateAccessToken from "../../utils/generateAccessToken.js";
import generateRefreshToken from "../../utils/generateRefreshToken.js";

const registerAdminService = async ({ name, email, password, req }) => {
  // ======================================
  // CHECK EXISTING ADMIN
  // ======================================

  const existingAdmin = await AdminModel.findOne({ email });

  if (existingAdmin) {
    throw new ApiError(409, "Admin already exists with this email.");
  }

  // ======================================
  // CREATE ADMIN
  // ======================================

  const admin = await AdminModel.create({
    name,
    email,
    password,
    role: "admin",
  });

  // ======================================
  // GENERATE TOKENS
  // ======================================

  const accessToken = generateAccessToken(admin);
  const refreshToken = generateRefreshToken(admin);

  // ======================================
  // SAVE REFRESH TOKEN
  // ======================================

  admin.refreshToken = refreshToken;
  await admin.save();


  // ======================================
  // RETURN DATA
  // ======================================

  return {
    admin,
    accessToken,
    refreshToken,
  };
};

export default registerAdminService;
