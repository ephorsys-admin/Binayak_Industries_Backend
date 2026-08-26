import transporter from "../config/nodemailer.config.js";

const sendResetOTP = async ({ email, name, otp }) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Name Of Company - Password Reset OTP",

        html: `
      <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;background:#f5f5f5;padding:30px">
        
        <div style="background:#ffffff;border-radius:10px;padding:30px">

          <h2 style="color:#0B5394;text-align:center">
            Name Of Company
          </h2>

          <p>Hello <strong>${name}</strong>,</p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Please use the following OTP to continue.
          </p>

          <div
            style="
              font-size:32px;
              font-weight:bold;
              text-align:center;
              letter-spacing:8px;
              color:#0B5394;
              margin:25px 0;
            "
          >
            ${otp}
          </div>

          <p>
            This OTP will expire in
            <strong>10 minutes</strong>.
          </p>

          <p>
            If you didn't request this password reset,
            simply ignore this email.
          </p>

          <hr>

          <p style="font-size:12px;color:#777;text-align:center">
            © ${new Date().getFullYear()}
            Name Of Company
          </p>

        </div>

      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

export default sendResetOTP;
