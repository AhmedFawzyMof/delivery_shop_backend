import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import {
  getAllDrivers,
  getDriverById,
  addDriver,
  editDriver,
  deleteDriver,
  updateOrderPickedUp,
  updateOrderDelivered,
  addFromAdmin,
} from "../controllers/driver.controller";
import { authMiddleware } from "../middleware/auth";
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

router.get("/", authMiddleware, getAllDrivers);
router.get("/:id", authMiddleware, getDriverById);
router.post(
  "/register",
  upload.fields([
    { name: "first_license_photo", maxCount: 1 },
    { name: "second_license_photo", maxCount: 1 },
    { name: "third_license_photo", maxCount: 1 },
    { name: "fourth_license_photo", maxCount: 1 },
  ]),
  addDriver
);
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "first_license_photo", maxCount: 1 },
    { name: "second_license_photo", maxCount: 1 },
    { name: "third_license_photo", maxCount: 1 },
    { name: "fourth_license_photo", maxCount: 1 },
  ]),
  addFromAdmin
);
router.put("/update_order/:id", authMiddleware, updateOrderPickedUp);
router.put("/order_delivered/:id", authMiddleware, updateOrderDelivered);
router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "first_license_photo", maxCount: 1 },
    { name: "second_license_photo", maxCount: 1 },
    { name: "third_license_photo", maxCount: 1 },
    { name: "fourth_license_photo", maxCount: 1 },
  ]),
  editDriver
);
router.delete("/:id", deleteDriver);

export default router;
