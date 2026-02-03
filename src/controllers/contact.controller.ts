import { ContactModel } from "../models/contact.model";
import { Request, Response } from "express";

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const data = await ContactModel.getAll();
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

export const getContactById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const data = await ContactModel.getById(id);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact" });
  }
};

export const createContact = async (req: Request, res: Response) => {
  try {
    const data = await ContactModel.create({
      contact_name: req.body.name,
      contact_phone: req.body.phone,
      contact_message: req.body.message,
    });
    console.log(data);
    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create contact" });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const data = await ContactModel.delete(id);
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete contact" });
  }
};
