import transporter from "../config/nodemailer.config.js";

/**
 * Sends order cancellation notification email to the customer.
 */
export const sendOrderCancelledEmail = async ({ order, reason = "" }) => {
  const { orderId, customer, pricing } = order;

  const mailOptions = {
    from: `"Binayak Industries" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: `Order Cancelled - ${orderId} - Binayak Industries`,
    html: `
      <div style="background-color: #f8f9fa; padding: 30px 15px; font-family: 'Helvetica Neue', Arial, sans-serif; color: #333333;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #424242 0%, #212121 100%); padding: 30px 25px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">BINAYAK INDUSTRIES</h1>
            <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Storefront Orders & Dispatch</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 30px 25px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="background: #ffebee; color: #c62828; font-weight: 700; font-size: 13px; padding: 6px 16px; border-radius: 20px; display: inline-block;">
                Order Cancelled
              </span>
              <h2 style="font-size: 20px; color: #1a1a1a; margin: 15px 0 5px 0;">Order Cancellation Notice</h2>
              <p style="color: #666666; font-size: 14px; margin: 0;">
                Dear ${customer.name}, your order <strong style="color: #c62828;">${orderId}</strong> for the amount of <strong>₹${pricing.grandTotal?.toLocaleString("en-IN")}</strong> has been cancelled.
              </p>
            </div>

            ${
              reason
                ? `
            <div style="background: #fff8f8; border: 1px solid #ffcdd2; border-radius: 8px; padding: 14px; margin-bottom: 25px;">
              <strong style="color: #c62828; font-size: 13px;">Reason / Note from Dispatch Team:</strong>
              <p style="margin: 5px 0 0 0; font-size: 13px; color: #444;">${reason}</p>
            </div>
            `
                : ""
            }

            <div style="background: #f0f7ff; border-left: 4px solid #0066cc; padding: 14px; border-radius: 4px; font-size: 13px; color: #004085; line-height: 1.5; margin-bottom: 25px;">
              <strong>Need help or have questions?</strong><br/>
              If this cancellation was in error or you would like to re-order, please reply directly to this email or call our customer support.
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #f7f7f7; padding: 20px 25px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee;">
            <p style="margin: 0 0 5px 0;">Binayak Industries • Support: support@binayakindustries.com</p>
            <p style="margin: 0;">© ${new Date().getFullYear()} Binayak Industries. All rights reserved.</p>
          </div>

        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send order cancelled email:", error);
  }
};

export default sendOrderCancelledEmail;
