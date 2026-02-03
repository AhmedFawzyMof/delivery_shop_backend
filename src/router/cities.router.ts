import { Router } from "express";
import {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
} from "../controllers/cities.controller";
import {
  authMiddleware,
  permissionMiddleware,
  roleMiddleware,
} from "../middleware/authentication.middleware";
import { Permissions } from "../constants/permission";
const router = Router();

router.get("/", getAllCities);
router.get("/:id", getCityById);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.CITY_CREATE]),
  createCity
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.CITY_EDIT]),
  updateCity
);

export default router;
