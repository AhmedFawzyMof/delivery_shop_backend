import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import {
  getAllDrivers,
  getActiveDriver,
  getDriverById,
  addDriver,
  editDriver,
  deleteDriver,
  updateOrderPickedUp,
  updateOrderDelivered,
  addFromAdmin,
  getAdminDriverById,
} from "../controllers/driver.controller";
import {
  authMiddleware,
  permissionMiddleware,
  roleMiddleware,
} from "../middleware/authentication.middleware";
import { Permissions } from "../constants/permission";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const driverId = Date.now().toString();

    req.body.driver_id = driverId;

    const uploadPath = path.join(
      process.cwd(),
      "public",
      "images",
      "drivers",
      "license",
      driverId
    );

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    const unique = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}.${ext}`;

    cb(null, unique);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.DRIVER_VIEW]),
  getAllDrivers
);
router.get(
  "/active",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.DRIVER_VIEW]),
  getActiveDriver
);
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "driver"]),
  getDriverById
);
router.get(
  "/admin/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.DRIVER_VIEW]),
  getAdminDriverById
);
router.post(
  "/register",
  upload.fields([
    { name: "first_license_photo", maxCount: 1 },
    { name: "second_license_photo", maxCount: 1 },
    { name: "third_license_photo", maxCount: 1 },
    { name: "fourth_license_photo", maxCount: 1 },
    { name: "fifth_license_photo", maxCount: 1 },
    { name: "sixth_license_photo", maxCount: 1 },
    { name: "seventh_license_photo", maxCount: 1 },
  ]),
  addDriver
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.DRIVER_CREATE]),
  upload.fields([
    { name: "first_license_photo", maxCount: 1 },
    { name: "second_license_photo", maxCount: 1 },
    { name: "third_license_photo", maxCount: 1 },
    { name: "fourth_license_photo", maxCount: 1 },
    { name: "fifth_license_photo", maxCount: 1 },
    { name: "sixth_license_photo", maxCount: 1 },
    { name: "seventh_license_photo", maxCount: 1 },
  ]),
  addFromAdmin
);
router.put(
  "/update_order/:id",
  authMiddleware,
  roleMiddleware(["driver"]),
  updateOrderPickedUp
);
router.put(
  "/order_delivered/:id",
  authMiddleware,
  roleMiddleware(["driver"]),
  updateOrderDelivered
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  permissionMiddleware([Permissions.DRIVER_EDIT]),
  upload.fields([
    { name: "first_license_photo", maxCount: 1 },
    { name: "second_license_photo", maxCount: 1 },
    { name: "third_license_photo", maxCount: 1 },
    { name: "fourth_license_photo", maxCount: 1 },
    { name: "fifth_license_photo", maxCount: 1 },
    { name: "sixth_license_photo", maxCount: 1 },
    { name: "seventh_license_photo", maxCount: 1 },
  ]),
  editDriver
);
// router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteDriver);

export default router;
