import express from "express";
import multer from "multer";
import {
  restaurant_login,
  driver_login,
  verify_session,
  admin_login,
} from "../controllers/auth.controller";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp");
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    cb(null, `selfie-${timestamp}-${file.originalname}`);
  },
});

const upload = multer({ storage });
const router = express.Router();

// Restaurant token will always be the same 24h ->
router.post("/restaurant/login", restaurant_login);

// Driver token will change based on the shift time 2~12h ->
router.post("/driver/login", upload.single("selfie"), driver_login);

// Admin login
router.post("/admin/login", admin_login);

// for refreshing the access token ->
router.get("/restaurant", verify_session);
router.get("/driver", verify_session);
router.get("/admin", verify_session);

export default router;
