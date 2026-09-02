import asyncHandler from "express-async-handler";
import { getSingleContactService } from "../../services/contacts/get.single.contact.service.js";

export const getSingleContact = asyncHandler(async (req, res) => {
  const contact = await getSingleContactService(
    req.params.contactId,
  );

  return res.status(200).json({
    success: true,
    message: "Contact fetched successfully.",
    data: contact,
  });
});