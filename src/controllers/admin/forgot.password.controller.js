import forgotPasswordService from "../../services/auth/forgot.password.service.js";

const forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;

    const response = await forgotPasswordService(email);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default forgotPasswordController;
