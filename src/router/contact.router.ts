import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";

const router = Router();

// Get all contacts
router.get("/", ContactController.getAll);

// Get a single contact
router.get("/:id", ContactController.getById);

// Create new contact
router.post("/", ContactController.create);

// Delete contact
router.delete("/:id", ContactController.delete);

export default router;
