import asyncHandler from "express-async-handler";
import { updateContactStatusService } from "../../services/contacts/update.contact.status.service.js";

export const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await updateContactStatusService(
    req.params.contactId,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Contact status updated successfully.",
    data: contact,
  });
});
