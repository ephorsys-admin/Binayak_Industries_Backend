import Contact from "../../model/contact.model.js";
import ApiError from "../../utils/ApiError.js";

export const getAllContactsService = async (query) => {
  const { page = 1, limit = 10, search = "", status } = query;

  const currentPage = Number(page);
  const perPage = Number(limit);

  const filter = {
    isDeleted: false,
  };

  // ==========================================================
  // Search
  // ==========================================================

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // ==========================================================
  // Status Filter
  // ==========================================================

  if (status) {
    filter.status = status;
  }

  const contacts = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * perPage)
    .limit(perPage);

  const total = await Contact.countDocuments(filter);

  return {
    contacts,
    pagination: {
      currentPage,
      totalPages: Math.ceil(total / perPage),
      totalRecords: total,
      limit: perPage,
    },
  };
};
