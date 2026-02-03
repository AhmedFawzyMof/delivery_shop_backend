import { Router } from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
} from "../controllers/contact.controller";
import {
  authMiddleware,
  permissionMiddleware,
  roleMiddleware,
} from "../middleware/authentication.middleware";
import { Permissions } from "../constants/permission";
const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.CONTACT_VIEW]),
  getAllContacts
);
router.post("/", createContact);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.CONTACT_VIEW]),
  getContactById
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.CONTACT_DELETE]),
  deleteContact
);

export default router;
