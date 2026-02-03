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
  permissionMiddleware([Permissions.ADMIN_VIEW]),
  getAllAdmins,
);
router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.DASHBOARD_VIEW]),
  adminDashboard,
);
router.get(
  "/orders",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.ORDER_VIEW]),
  adminOrders,
);
router.get(
  "/all/orders",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.ORDER_VIEW]),
  adminOrders,
);
router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.ADMIN_VIEW]),
  getAdminById,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.ADMIN_CREATE]),
  createAdmin,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.ADMIN_EDIT]),
  updateAdmin,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.ADMIN_DELETE]),
  deleteAdmin,
);

export default router;
