import { Request, Response } from "express";
import { CitiesModel } from "../models/cities.model";
import { OrderModel } from "../models/order.model";
import { AdminModel } from "../models/admin.model";
import tryCatch from "../utils/trycatch";
import { countActiveDriversByCities } from "../utils/activeDrivers";
import crypto from "crypto";

const adminDashboard = async (req: Request, res: Response) => {
  const adminUser = (req as any).user.data;

  const cities = await CitiesModel.getCityByBranchId(
    adminUser.branches.branch_id
  );

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59
  );
  const startISO = startOfMonth.toISOString();
  const endISO = endOfMonth.toISOString();

  const citiesName: any = cities.map((c) => c.city_name);

  const { data: stats, error: statsError } = await tryCatch(
    AdminModel.getStats(startISO, endISO, citiesName)
  );

  if (statsError) {
    console.log(statsError);
    return res.status(500).json({ message: statsError.message });
  }

  const { data: orders, error: ordersError } = await tryCatch(
    OrderModel.getLatest(citiesName)
  );

  if (ordersError) {
    console.log(ordersError);
    return res.status(500).json({ message: ordersError.message });
  }

  const activeDrivers = countActiveDriversByCities(citiesName);

  return res.status(200).json({
    stats,
    orders,
    activeDrivers,
  });
};

const adminOrders = async (req: Request, res: Response) => {
  const adminUser = (req as any).user.data;
  const page = req.query.page ? Number(req.query.page) : 1;
  const city = req.query.city as string | undefined;

  const cities = await CitiesModel.getCityByBranchId(
    adminUser.branches.branch_id
  );

  const from_date = req.query.from
    ? new Date(req.query.from as string).toISOString().split("T")[0]
    : undefined;
  const to_date = req.query.to
    ? new Date(req.query.to as string).toISOString().split("T")[0]
    : undefined;

  if (from_date && to_date && from_date > to_date) {
    return res.status(400).json({ message: "Invalid date range" });
  }

  if (!from_date && !to_date) {
    return res.status(400).json({ message: "Missing date range" });
  }

  const { data, error } = await tryCatch(
    OrderModel.getAdminStats(
      from_date!,
      to_date!,
      city,
      adminUser.branches.branch_id
    )
  );

  if (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
  const { data: orders, error: ordersError } = await tryCatch(
    OrderModel.getAllAdmin(
      from_date!,
      to_date!,
      city,
      adminUser.branches.branch_id,
      page
    )
  );

  if (ordersError) {
    console.log(ordersError);
    res.status(500).json({ message: ordersError.message });
  }

  res.json({ stats: data, orders, cities });
};

const getAllAdmins = async (req: Request, res: Response) => {
  const { data, error } = await tryCatch(AdminModel.getAll());

  if (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }

  res.status(200).json(data);
};
const getAdminById = async (req: Request, res: Response) => {};
const createAdmin = async (req: Request, res: Response) => {
  const password = req.body.password;
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
  const { data, error } = await tryCatch(
    AdminModel.create({
      ...req.body,
      password: hashedPassword,
    })
  );

  if (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }

  res.status(201).json(data);
};
const updateAdmin = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data, error } = await tryCatch(AdminModel.update(id, req.body));

  if (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }

  res.status(200).json(data);
};
const deleteAdmin = async (req: Request, res: Response) => {};

export {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  adminDashboard,
  adminOrders,
};
