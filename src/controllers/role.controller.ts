import { Request, Response } from "express";

const getAllRoles = async (req: Request, res: Response) => {
  try {
    res.json({ message: "Get all roles" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

const getRoleById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `Get role with ID ${id}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch role" });
  }
};

const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    res.status(201).json({
      message: "Role created successfully",
      data: { name, description },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create role" });
  }
};

const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    res.json({
      message: `Role ${id} updated successfully`,
      data: { name, description },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update role" });
  }
};

const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `Role ${id} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete role" });
  }
};

export { getAllRoles, getRoleById, createRole, updateRole, deleteRole };
