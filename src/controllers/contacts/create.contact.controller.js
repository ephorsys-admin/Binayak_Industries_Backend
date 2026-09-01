import asyncHandler from "express-async-handler";
import { createContactService } from "../../services/contacts/create.contact.service.js";

export const createContact = asyncHandler(async (req, res) => {
  const contact = await createContactService(req.body);

  // Emit real-time notification via WebSockets
  const io = req.app.get("io");
  if (io) {
    io.emit("new_contact", contact);
  }

  return res.status(201).json({
    success: true,
    message: "Contact request submitted successfully.",
    data: contact,
  });
});
