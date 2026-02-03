import { Router } from "express";
import {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from "../controllers/branch.controller";
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
  permissionMiddleware([Permissions.BRANCH_VIEW]),
  getAllBranches
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.BRANCH_VIEW]),
  getBranchById
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.BRANCH_CREATE]),
  createBranch
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.BRANCH_EDIT]),
  updateBranch
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.BRANCH_DELETE]),
  deleteBranch
);
export default router;
