import loginAdminService from "../../services/auth/login.admin.service.js";

const loginAdminController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { admin, accessToken, refreshToken } = await loginAdminService({
      email,
      password,
      req,
    });

    // ======================================
    // REFRESH TOKEN COOKIE
    // ======================================

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    });

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,
      message: "Login successful",

      accessToken,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default loginAdminController;
