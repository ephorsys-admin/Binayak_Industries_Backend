import mongoose from "mongoose";
import Contact from "../../model/contact.model.js";
import ApiError from "../../utils/ApiError.js";

export const getSingleContactService = async (contactId) => {
  // ==========================================================
  // Validate Contact ID
  // ==========================================================

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new ApiError(400, "Invalid Contact ID.");
  }

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

  return contact;
};
