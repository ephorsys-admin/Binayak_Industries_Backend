import AdminModel from "../../model/admin.model.js";
import ApiError from "../../utils/ApiError.js";


const logoutAdminService = async ({ adminId, req }) => {
  const admin = await AdminModel.findById(adminId);

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  admin.refreshToken = null;

  // Invalidate all access tokens
  admin.tokenVersion += 1;

  await admin.save();


  return true;
};

export default logoutAdminService;
