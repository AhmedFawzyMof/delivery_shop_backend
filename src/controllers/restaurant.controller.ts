import { Request, Response } from "express";
import { RestaurantModel } from "../models/restaurant.model.js";
import tryCatch from "../utils/trycatch.js";
import { convertToWebp } from "../utils/imageconverter.js";
import path from "path";
import fs from "fs";
import { extractLocationFromGoogleMapsLink } from "../utils/location.js";
import { CitiesModel } from "../models/cities.model.js";
import crypto from "crypto";

export const getAllRestaurants = async (req: Request, res: Response) => {
  const adminUser = (req as any).user.data;
  const page = req.query.page ? Number(req.query.page) : 1;
  const search = req.query.search as string;
  const city = req.query.city as string;

  const { data, error } = await tryCatch(
    RestaurantModel.getAll(search, city, page, adminUser.branches.branch_id)
  );

  if (error) {
    res.status(500).json({ message: error.message });
  }

  const cities = await CitiesModel.getCityByBranchId(
    adminUser.branches.branch_id
  );

  res.json({ restaurants: data, cities });
};

export const getRestaurantById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data: restaurant, error } = await tryCatch(
    RestaurantModel.getById(id)
  );

  if (error) {
    res.status(500).json({ message: error.message });
  }

  res.json(restaurant);
};

export const createRestaurant = async (req: Request, res: Response) => {
  const {
    restaurant_name,
    restaurant_city,
    address,
    commercial_register,
    password,
    location,
  } = req.body;

  let imagePath = "";

  if (req.file) {
    try {
      const restaurantName = restaurant_name.replace(/\s/g, "");
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "images",
        "restaurant",
        restaurantName
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = await convertToWebp(req.file.path, uploadDir);
      imagePath = `/images/restaurant/${restaurantName}/${fileName}`;
    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
  }

  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  let parsedLocation = null;

  if (location && typeof location === "string" && location.includes(",")) {
    const [latStr, lngStr] = location.split(",").map((v) => v.trim());
    parsedLocation = {
      lat: parseFloat(latStr),
      lng: parseFloat(lngStr),
    };
  } else {
    return res.status(400).json({ message: "Invalid location format" });
  }

  const { data, error } = await tryCatch(
    RestaurantModel.create({
      restaurant_name,
      restaurant_city: restaurant_city,
      logo_image: imagePath,
      address,
      commercial_register,
      location: JSON.stringify(parsedLocation),
      password: hashedPassword,
    })
  );

  if (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
};

export const updateRestaurant = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const ban = req.query.ban;

  if (ban) {
    const value = JSON.parse(ban as string) || false;
    const { data: _, error } = await tryCatch(
      RestaurantModel.update(id, { is_baned: value })
    );
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    return res.json({ success: true });
  }

  if (req.body.location && req.body.location.includes("google.com/maps")) {
    const location = extractLocationFromGoogleMapsLink(req.body.location);
    req.body.location = JSON.stringify(location);
  }

  if (req.body.password && req.body.password.length > 0) {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(req.body.password)
      .digest("hex");
    req.body.password = hashedPassword;
  }

  const { data: _, error } = await tryCatch(
    RestaurantModel.update(id, req.body)
  );

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ success: true });
};

export const deleteRestaurant = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data, error } = await tryCatch(RestaurantModel.delete(id));

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
};
