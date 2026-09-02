import Contact from "../../model/contact.model.js";
import ApiError from "../../utils/ApiError.js";

export const updateContactStatusService = async (contactId, data) => {
  const { status } = data;

  // ==========================================================
  // Find Contact
  // ==========================================================

  const contact = await Contact.findOne({
    _id: contactId,
    isDeleted: false,
  });

  if (!contact) {
    throw new ApiError(404, "Contact not found.");
  }

  // ==========================================================
  // Update Status
  // ==========================================================

  contact.status = status;

  await contact.save();

  return contact;
};
