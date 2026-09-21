import transporter from "../config/nodemailer.config.js";

/**
 * Sends order confirmation email to the customer with full order summary and items list.
 */
export const sendOrderConfirmationEmail = async ({ order }) => {
  const { orderId, customer, items, pricing } = order;

  // Render rows for items
  const itemsRows = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 12px 8px; text-align: left; font-size: 14px; color: #333333;">
          <strong>${item.name}</strong>
          ${item.unit ? `<br/><span style="font-size: 12px; color: #777777;">Unit: ${item.unit}</span>` : ""}
        </td>
        <td style="padding: 12px 8px; text-align: center; font-size: 14px; color: #333333;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-size: 14px; color: #333333;">
          ₹${item.sellingPrice.toLocaleString("en-IN")}
        </td>
        <td style="padding: 12px 8px; text-align: right; font-weight: 600; font-size: 14px; color: #8B1E1E;">
          ₹${item.itemTotal.toLocaleString("en-IN")}
        </td>
      </tr>
    `
    )
    .join("");

  const mailOptions = {
    from: `"Binayak Industries" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: `Order Confirmation ${orderId} - Binayak Industries`,
    html: `
      <div style="background-color: #f8f9fa; padding: 30px 15px; font-family: 'Helvetica Neue', Arial, sans-serif; color: #333333;">
        <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
          
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #8B1E1E 0%, #5B0E0E 100%); padding: 30px 25px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">BINAYAK INDUSTRIES</h1>
            <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.9;">Storefront Orders & Dispatch</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 30px 25px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="background: #e8f5e9; color: #2e7d32; font-weight: 600; font-size: 13px; padding: 6px 14px; border-radius: 20px; display: inline-block;">
                Order Placed Successfully
              </span>
              <h2 style="font-size: 20px; color: #1a1a1a; margin: 15px 0 5px 0;">Thank you, ${customer.name}!</h2>
              <p style="color: #666666; font-size: 14px; margin: 0;">
                Your order <strong style="color: #8B1E1E;">${orderId}</strong> has been received. Our team will contact you shortly to confirm and dispatch your items.
              </p>
            </div>

            <!-- Delivery Details Box -->
            <div style="background: #fdf8f5; border: 1px solid #fae1d6; border-radius: 8px; padding: 16px; margin-bottom: 25px;">
              <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #8B1E1E; text-transform: uppercase; letter-spacing: 0.5px;">
                ${(order.isOrderingForSomeoneElse || customer.isOrderingForSomeoneElse) ? "🎁 Recipient Delivery Details" : "Delivery Details"}
              </h3>
              <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #444444;">
                ${(order.isOrderingForSomeoneElse || customer.isOrderingForSomeoneElse) && (order.recipient?.name || customer.recipient?.name)
                  ? `<strong>Recipient:</strong> ${order.recipient?.name || customer.recipient?.name}<br/><strong>Recipient Phone:</strong> ${order.recipient?.phone || customer.recipient?.phone}<br/>`
                  : `<strong>${customer.name}</strong><br/><strong>Phone:</strong> ${customer.phone}<br/>`
                }
                <strong>Address:</strong> ${customer.address}${customer.landmark ? `, Near ${customer.landmark}` : ""}<br/>
                ${customer.city}, ${customer.state} - ${customer.pincode}
              </p>
              ${(order.isOrderingForSomeoneElse || customer.isOrderingForSomeoneElse) && (order.recipient?.giftMessage || customer.recipient?.giftMessage)
                ? `<div style="margin-top: 12px; padding: 10px 12px; background: #fff; border-left: 3px solid #8B1E1E; border-radius: 4px; font-size: 13px; color: #555;">
                    <strong style="color: #8B1E1E;">💌 Gift Note:</strong> "${order.recipient?.giftMessage || customer.recipient?.giftMessage}"
                   </div>`
                : ""
              }
            </div>

            <!-- Order Summary Table -->
            <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #1a1a1a;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #f7f7f7; color: #666666; font-size: 12px; text-transform: uppercase;">
                  <th style="padding: 10px 8px; text-align: left;">Item</th>
                  <th style="padding: 10px 8px; text-align: center;">Qty</th>
                  <th style="padding: 10px 8px; text-align: right;">Price</th>
                  <th style="padding: 10px 8px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <!-- Pricing Summary -->
            <div style="background: #fafafa; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #555555;">
                <span>Items Subtotal:</span>
                <span style="font-weight: 600;">₹${pricing.itemsTotal.toLocaleString("en-IN")}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #555555;">
                <span>Delivery Fee:</span>
                <span style="font-weight: 600; color: #2e7d32;">
                  ${pricing.shippingFee === 0 ? "FREE" : `₹${pricing.shippingFee.toLocaleString("en-IN")}`}
                </span>
              </div>
              <hr style="border: 0; border-top: 1px solid #e5e5e5; margin: 10px 0;"/>
              <div style="display: flex; justify-content: space-between; font-size: 17px; font-weight: 700; color: #8B1E1E;">
                <span>Grand Total:</span>
                <span>₹${pricing.grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <!-- Next steps -->
            <div style="background: #f0f7ff; border-left: 4px solid #0066cc; padding: 14px; border-radius: 4px; font-size: 13px; color: #004085; line-height: 1.5;">
              <strong>What happens next?</strong><br/>
              Our dispatch team will review your order, package your items fresh, and reach out via phone (${customer.phone}) for delivery scheduling.
            </div>

          </div>

          <!-- Footer -->
          <div style="background: #f7f7f7; padding: 20px 25px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee;">
            <p style="margin: 0 0 5px 0;">Need help with your order? Contact us at support@binayakindustries.com</p>
            <p style="margin: 0;">© ${new Date().getFullYear()} Binayak Industries. All rights reserved.</p>
          </div>

        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send order confirmation email:", error);
    // Don't throw error to avoid aborting successful order creation if SMTP fails
  }
};

export default sendOrderConfirmationEmail;
