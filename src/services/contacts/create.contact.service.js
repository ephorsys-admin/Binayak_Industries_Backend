import Contact from "../../model/contact.model.js";
import ApiError from "../../utils/ApiError.js";

export const createContactService = async (data) => {
  const { name, phone, email, reason } = data;

  // ==========================================================
  // Check Existing Contact (Optional)
  // ==========================================================

  const existingContact = await Contact.findOne({
    phone,
    reason,
    status: "Pending",
    isDeleted: false,
  });

  if (existingContact) {
    throw new ApiError(400, "You have already submitted this contact request.");
  }

  // ==========================================================
  // Create Contact
  // ==========================================================

  const contact = await Contact.create({
    name,
    phone,
    email,
    reason,
  });

  return contact;
};
