import express from "express";
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller";
import {
  authMiddleware,
  permissionMiddleware,
  roleMiddleware,
} from "../middleware/authentication.middleware";
import multer from "multer";
import { Permissions } from "../constants/permission";

const upload = multer({ dest: "temp/" });

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.RESTAURANT_VIEW]),
  getAllRestaurants,
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.RESTAURANT_VIEW]),
  getRestaurantById,
);
router.post("/register", upload.single("logo"), createRestaurant);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.RESTAURANT_CREATE]),
  upload.single("logo"),
  createRestaurant,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.RESTAURANT_EDIT]),
  updateRestaurant,
);

// router.delete(
//   "/:id",
//   authMiddleware,
//   roleMiddleware(["admin"]),
//   permissionMiddleware([Permissions.RESTAURANT_DELETE]),
//   deleteRestaurant
// );

export default router;
