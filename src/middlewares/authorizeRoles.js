import ApiError from "../utils/ApiError.js";

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.admin.role)) {
      return next(
        new ApiError(
          403,
          `Role '${req.admin.role}' is not authorized to access this resource`,
        ),
      );
    }

    next();
  };
};

export default authorizeRoles;
