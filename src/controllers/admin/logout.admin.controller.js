import logoutAdminService from "../../services/auth/logout.admin.service.js";

const logoutAdminController = async (req, res, next) => {
  try {
    await logoutAdminService({
      adminId: req.admin._id,
      req,
    });

    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

export default logoutAdminController;
