import express from "express";
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurant.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import multer from "multer";

const upload = multer({ dest: "temp/" });

const router = express.Router();

router.get("/", authMiddleware, getAllRestaurants);
router.get("/:id", authMiddleware, getRestaurantById);
router.post("/register", createRestaurant);
router.post("/", authMiddleware, upload.single("logo"), createRestaurant);
router.put("/:id", authMiddleware, updateRestaurant);
router.delete("/:id", authMiddleware, deleteRestaurant);

export default router;
