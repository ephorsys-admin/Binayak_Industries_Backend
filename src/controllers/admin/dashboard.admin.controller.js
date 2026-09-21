import getAdminDashboardService from "../../services/admin/getAdminDashboard.service.js";

/**
 * ==========================================================
 * ADMIN DASHBOARD CONTROLLER
 * Single unified API endpoint to fetch all admin dashboard data.
 * ==========================================================
 */
const getAdminDashboardController = async (req, res, next) => {
  try {
    const dashboardData = await getAdminDashboardService();

    return res.status(200).json({
      success: true,
      message: "Admin dashboard data fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};

export default getAdminDashboardController;
