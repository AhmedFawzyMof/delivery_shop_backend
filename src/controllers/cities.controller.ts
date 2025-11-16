import { CitiesModel } from "../models/cities.model";
import { Request, Response } from "express";
import tryCatch from "../utils/trycatch";

const getAllCities = async (req: Request, res: Response) => {
  const { data: allCities, error } = await tryCatch(CitiesModel.getAllCities());

  if (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }

  res.status(200).json(allCities);
};

const getCityById = async (req: Request, res: Response) => {
  const cityId = parseInt(req.params.id);
  const { data: city, error } = await tryCatch(CitiesModel.getCityById(cityId));

  if (error) {
    res.status(500).json({ message: error.message });
  }

  res.status(200).json(city);
};

const createCity = async (req: Request, res: Response) => {
  const { city_name, branch_id } = req.body;

  const { data: newCity, error } = await tryCatch(
    CitiesModel.createCity(city_name, branch_id)
  );

  if (error) {
    res.status(500).json({ message: error.message });
  }

  res.status(201).json(newCity);
};

const updateCity = async (req: Request, res: Response) => {
  const cityId = parseInt(req.params.id);
  const { city_name } = req.body;
  const { data: updatedCity, error } = await tryCatch(
    CitiesModel.updateCity(cityId, city_name)
  );

  if (error) {
    res.status(500).json({ message: error.message });
  }
  res.status(200).json(updatedCity);
};

const deleteCity = async (req: Request, res: Response) => {
  const cityId = parseInt(req.params.id);
  const { data: deletedCity, error } = await tryCatch(
    CitiesModel.deleteCity(cityId)
  );

  if (error) {
    res.status(500).json({ message: error.message });
  }
  res.status(200).json(deletedCity);
};

export { getAllCities, getCityById, createCity, updateCity, deleteCity };
