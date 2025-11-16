import { Request, Response } from "express";
import { UserModel } from "../models/user.model.js";
import tryCatch from "../utils/trycatch.js";

export const getAllUsers = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const search = req.query.search ? String(req.query.search) : "";
  const restaurant = (req as any).user;

  const { data, error } = await tryCatch(
    UserModel.getAll(search, page, restaurant.id)
  );

  if (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }

  res.json({ users: data });
};

export const getUserById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data, error } = await tryCatch(UserModel.getById(id));

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
};

export const createUser = async (req: Request, res: Response) => {
  const { data, error } = await tryCatch(UserModel.create(req.body));

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
};

export const updateUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data, error } = await tryCatch(UserModel.update(id, req.body));

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { data, error } = await tryCatch(UserModel.delete(id));

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
};
