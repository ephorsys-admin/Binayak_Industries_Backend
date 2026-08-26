import refreshTokenService from "../../services/auth/refreshToken.service.js";

const refreshTokenController = async (req, res, next) => {
  try {
    // Get refresh token from cookie or body
    const token = req.cookies.refreshToken || req.body.refreshToken;

    const { admin, accessToken, refreshToken } = await refreshTokenService({
      refreshToken: token,
      req,
    });

    // Set new refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
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

export default refreshTokenController;
