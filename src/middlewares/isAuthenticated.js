import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import AdminModel from "../model/admin.model.js";


const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // ======================================
    // GET TOKEN FROM HEADER
    // ======================================

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ApiError(401, "Access token is required");
    }

    // ======================================
    // VERIFY TOKEN
    // ======================================

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (verifyError) {
      if (verifyError.name === "TokenExpiredError") {
        throw new ApiError(401, "Token expired");
      }
      throw new ApiError(401, "Invalid token");
    }

    // ======================================
    // FIND ADMIN
    // ======================================

    const admin = await AdminModel.findById(decoded.id);

    if (!admin) {
      throw new ApiError(401, "Admin not found");
    }

    // ======================================
    // ACCOUNT CHECK
    // ======================================

    if (!admin.isActive) {
      throw new ApiError(403, "Account is inactive");
    }

    if (admin.isBlocked) {
      throw new ApiError(403, "Account is blocked");
    }

    // ======================================
    // TOKEN VERSION CHECK
    // ======================================

    if (decoded.tokenVersion !== admin.tokenVersion) {
      throw new ApiError(401, "Session expired. Please login again.");
    }

    // ======================================
    // ATTACH ADMIN TO REQUEST
    // ======================================

    req.admin = admin;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export default isAuthenticated;
