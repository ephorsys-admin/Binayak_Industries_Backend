import registerAdminService from "../../services/auth/register.admin.service.js";

const registerAdminController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const { admin, accessToken, refreshToken } = await registerAdminService({
      name,
      email,
      password,
      req,
    });

    // ======================================
    // SET REFRESH TOKEN COOKIE
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

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully.",

      accessToken,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default registerAdminController;
