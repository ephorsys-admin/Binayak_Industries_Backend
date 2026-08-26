import jwt from "jsonwebtoken";
import ApiError from "../../utils/ApiError.js";
import AdminModel from "../../model/admin.model.js";
import generateAccessToken from "../../utils/generateAccessToken.js";
import generateRefreshToken from "../../utils/generateRefreshToken.js";

const refreshTokenService = async ({ refreshToken, req }) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required.");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const admin = await AdminModel.findById(decoded.id).select("+refreshToken");
    if (!admin) {
      throw new ApiError(401, "Admin not found.");
    }

    if (!admin.isActive) {
      throw new ApiError(403, "Account is inactive.");
    }

    if (admin.isBlocked) {
      throw new ApiError(403, "Account is blocked.");
    }

    if (decoded.tokenVersion !== admin.tokenVersion) {
      throw new ApiError(401, "Session expired. Please login again.");
    }

    if (admin.refreshToken !== refreshToken) {
      throw new ApiError(401, "Invalid refresh token or session already used.");
    }

    // Generate new tokens (Rotation)
    const newAccessToken = generateAccessToken(admin);
    const newRefreshToken = generateRefreshToken(admin);

    admin.refreshToken = newRefreshToken;
    await admin.save();

    return {
      admin,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token expired. Please login again.");
    }
    throw new ApiError(401, error.message || "Invalid refresh token.");
  }
};

export default refreshTokenService;
