import asyncHandler from "express-async-handler";
import { getAllContactsService } from "../../services/contacts/get.all.contacts.service.js";

export const getAllContacts = asyncHandler(async (req, res) => {
  const result = await getAllContactsService(req.query);

  return res.status(200).json({
    success: true,
    message: "Contacts fetched successfully.",
    ...result,
  });
});
