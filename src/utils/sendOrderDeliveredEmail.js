import transporter from "../config/nodemailer.config.js";

/**
 * Sends order delivery confirmation email to the customer.
 */
export const sendOrderDeliveredEmail = async ({ order }) => {
  const { orderId, customer, items, pricing } = order;

  const itemsRows = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 10px 8px; text-align: left; font-size: 13px; color: #333333;">
          <strong>${item.name}</strong>
          ${item.unit ? `<br/><span style="font-size: 11px; color: #777777;">Unit: ${item.unit}</span>` : ""}
        </td>
        <td style="padding: 10px 8px; text-align: center; font-size: 13px; color: #333333;">
          ${item.quantity}
        </td>
        <td style="padding: 10px 8px; text-align: right; font-weight: 600; font-size: 13px; color: #2e7d32;">
          ₹${item.itemTotal?.toLocaleString("en-IN") || item.sellingPrice * item.quantity}
        </td>
      </tr>
    `
    )
    .join("");

  const mailOptions = {
    from: `"Binayak Industries" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: `Order Delivered Successfully 🎉 - ${orderId} - Binayak Industries`,
    html: `
      <div style="background-color: #f8f9fa; padding: 30px 15px; font-family: 'Helvetica Neue', Arial, sans-serif; color: #333333;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #1b5e20 0%, #0d3c11 100%); padding: 30px 25px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">BINAYAK INDUSTRIES</h1>
            <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Artisanal Namkeens & Sweets</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 30px 25px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="background: #e8f5e9; color: #2e7d32; font-weight: 700; font-size: 13px; padding: 6px 16px; border-radius: 20px; display: inline-block;">
                ✓ Order Delivered
              </span>
              <h2 style="font-size: 22px; color: #1a1a1a; margin: 15px 0 5px 0;">Enjoy Your Fresh Snacks, ${customer.name}!</h2>
              <p style="color: #666666; font-size: 14px; margin: 0;">
                Your order <strong style="color: #1b5e20;">${orderId}</strong> has been successfully delivered to your doorstep.
              </p>
            </div>

            <!-- Delivery Summary -->
            <div style="background: #f4faf4; border: 1px solid #c8e6c9; border-radius: 8px; padding: 16px; margin-bottom: 25px;">
              <h3 style="margin: 0 0 8px 0; font-size: 13px; color: #2e7d32; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Address</h3>
              <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #333333;">
                <strong>${customer.name}</strong><br/>
                ${customer.address}${customer.landmark ? `, Near ${customer.landmark}` : ""}<br/>
                ${customer.city}, ${customer.state} - ${customer.pincode}
              </p>
            </div>

            <!-- Items -->
            <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #1a1a1a;">Delivered Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #f7f7f7; color: #666666; font-size: 12px; text-transform: uppercase;">
                  <th style="padding: 8px; text-align: left;">Item</th>
                  <th style="padding: 8px; text-align: center;">Qty</th>
                  <th style="padding: 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <!-- Grand Total -->
            <div style="background: #fafafa; border-radius: 8px; padding: 14px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 14px; font-weight: 600; color: #333;">Total Paid (${order.paymentMethod}):</span>
              <span style="font-size: 18px; font-weight: 800; color: #1b5e20;">₹${pricing.grandTotal?.toLocaleString("en-IN")}</span>
            </div>

            <!-- Thank You Note -->
            <div style="background: #fdf8f5; border-left: 4px solid #8B1E1E; padding: 14px; border-radius: 4px; font-size: 13px; color: #4a2c2c; line-height: 1.5;">
              <strong>Thank you for choosing Binayak Industries!</strong><br/>
              We hope you love our fresh, pure groundnut-oil fried namkeens. We look forward to serving you again soon!
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #f7f7f7; padding: 20px 25px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee;">
            <p style="margin: 0 0 5px 0;">Need assistance or have feedback? Contact us at support@binayakindustries.com</p>
            <p style="margin: 0;">© ${new Date().getFullYear()} Binayak Industries. All rights reserved.</p>
          </div>

        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send order delivered email:", error);
  }
};

export default sendOrderDeliveredEmail;
