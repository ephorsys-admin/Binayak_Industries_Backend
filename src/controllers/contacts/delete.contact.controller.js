import asyncHandler from "express-async-handler";
import { deleteContactService } from "../../services/contacts/delete.contact.service.js";

export const deleteContact = asyncHandler(async (req, res) => {
  await deleteContactService(req.params.contactId, req.admin._id);

  return res.status(200).json({
    success: true,
    message: "Contact deleted successfully.",
  });
});
