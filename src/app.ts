import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import restaurantRoutes from "./router/restaurant.router";
import driverRoutes from "./router/driver.router";
import orderRoutes from "./router/order.router";
import authRoutes from "./router/auth.router";
import citiesRouter from "./router/cities.router";
import branchesRouter from "./router/branch.router";
import adminRoutes from "./router/admin.router";
import roleRouter from "./router/role.router";
import contactRouter from "./router/contact.router";
import path from "path";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cities", citiesRouter);
app.use("/api/branches", branchesRouter);
app.use("/api/admins", adminRoutes);
app.use("/api/roles", roleRouter);
app.use("/api/contacts", contactRouter);

app.use((req, res, next) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
  } else {
    next();
  }
});

export default app;
