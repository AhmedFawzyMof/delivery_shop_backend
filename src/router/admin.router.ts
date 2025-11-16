import { Router } from "express";
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  adminDashboard,
  adminOrders,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getAllAdmins);
router.get("/dashboard", authMiddleware, adminDashboard);
router.get("/orders", authMiddleware, adminOrders);
router.get("/admin/:id", getAdminById);
router.post("/", createAdmin);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

export default router;
