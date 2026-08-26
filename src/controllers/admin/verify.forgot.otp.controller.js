import verifyForgotOtpService from "../../services/auth/verify.forgot.otp.service.js";

const verifyForgotOtpController = async (req, res, next) => {
  try {
    const response = await verifyForgotOtpService(req.body);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export default verifyForgotOtpController;
