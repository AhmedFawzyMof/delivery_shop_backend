import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrdersAdmin,
  assignOrder,
  adminUpdateOrder,
} from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const uploadPath = "public/images/temp";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.get("/", authMiddleware, getAllOrders);
router.get("/admin", authMiddleware, getAllOrdersAdmin);
router.get("/order/:id", authMiddleware, getOrderById);
router.post("/", authMiddleware, upload.single("receiptImage"), createOrder);
router.post("/assign", authMiddleware, assignOrder);
router.put("/admin/:id", authMiddleware, adminUpdateOrder);
router.put("/:id", authMiddleware, updateOrder);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;
