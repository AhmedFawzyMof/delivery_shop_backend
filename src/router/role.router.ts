import { Router } from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/role.controller";

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
  permissionMiddleware([Permissions.ADMIN_EDIT]),
  getAllRoles
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.ROLE_VIEW]),
  getRoleById
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.ROLE_CREATE]),
  createRole
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.ROLE_EDIT]),
  updateRole
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.ROLE_DELETE]),
  deleteRole
);
export default router;
