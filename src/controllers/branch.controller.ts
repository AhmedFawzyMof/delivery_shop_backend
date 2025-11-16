import { Request, Response } from "express";
import tryCatch from "../utils/trycatch";
import { BranchesModel } from "../models/branches.model";
import { branches } from "../config/db/schema";

const getAllBranches = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await tryCatch(BranchesModel.getAll());
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to fetch branches" });
    }

    res.json({ branches: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch branches" });
  }
};

const getBranchById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `Get branch with ID ${id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch branch" });
  }
};

const createBranch = async (req: Request, res: Response) => {
  try {
    const { name, city, address, restaurant_id } = req.body;

    if (!name || !city || !address || !restaurant_id) {
      return res.status(422).json({ message: "Missing required fields" });
    }

    res.status(201).json({
      message: "Branch created successfully",
      data: { name, city, address, restaurant_id },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create branch" });
  }
};

const updateBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, city, address } = req.body;
    res.json({
      message: `Branch ${id} updated successfully`,
      data: { name, city, address },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update branch" });
  }
};

const deleteBranch = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `Branch ${id} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete branch" });
  }
};

export {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
