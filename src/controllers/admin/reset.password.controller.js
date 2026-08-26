import resetPasswordService from "../../services/auth/reset.password.service.js";

const resetPasswordController = async (req, res, next) => {
  try {
    const response = await resetPasswordService(req.body);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default resetPasswordController;
