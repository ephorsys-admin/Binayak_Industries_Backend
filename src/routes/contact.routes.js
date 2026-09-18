import express from "express";
import { createContact } from "../controllers/contacts/create.contact.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import { getAllContacts } from "../controllers/contacts/get.all.contacts.controller.js";
import { getSingleContact } from "../controllers/contacts/get.single.contact.controller.js";
import { updateContactStatus } from "../controllers/contacts/update.contact.status.controller.js";
import { deleteContact } from "../controllers/contacts/delete.contact.controller.js";

const ContactRouter = express.Router();

// ==========================================================
// Public APIs
// ==========================================================

// Create Contact
ContactRouter.post("/create", createContact);

// ==========================================================
// Admin APIs
// ==========================================================

// Get All Contacts
ContactRouter.get(
  "/admin/all",
  isAuthenticated,
  authorizeRoles("super_admin", "admin"),
  getAllContacts,
);

// ==========================================================
// Get Single Contact
// ==========================================================

ContactRouter.get(
  "/admin/:contactId",
  isAuthenticated,
  authorizeRoles("super_admin", "admin"),
  getSingleContact,
);

// ==========================================================
// Update Contact Status
// ==========================================================

ContactRouter.patch(
  "/admin/status/:contactId",
  isAuthenticated,
  authorizeRoles("super_admin", "admin"),

  updateContactStatus,
);

// ==========================================================
// Delete Contact
// ==========================================================

ContactRouter.delete(
  "/admin/delete/:contactId",
  isAuthenticated,
  authorizeRoles("super_admin", "admin"),
  deleteContact,
);

export default ContactRouter;
