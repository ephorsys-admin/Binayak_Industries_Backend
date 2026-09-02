import Contact from "../../model/contact.model.js";
import ApiError from "../../utils/ApiError.js";

export const deleteContactService = async (contactId, adminId) => {
  const contact = await Contact.findOne({
    _id: contactId,
    isDeleted: false,
  });

  if (!contact) {
    throw new ApiError(404, "Contact not found.");
  }

  contact.isDeleted = true;
  contact.deletedAt = new Date();
  contact.deletedBy = adminId;

  await contact.save();

  return;
};
