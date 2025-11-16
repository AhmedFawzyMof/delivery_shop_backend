import { db } from "../config/db";
import { cities } from "../config/db/schema";
import { eq } from "drizzle-orm";

export class CitiesModel {
  static async getAllCities() {
    const allCities = await db.select().from(cities);
    return allCities;
  }

  static async getCityByBranchId(branchId: number) {
    return db
      .select({
        city_name: cities.city_name,
      })
      .from(cities)
      .where(eq(cities.branch_id, branchId))
      .all();
  }

  static async getCityById(cityId: number) {
    const city = await db
      .select()
      .from(cities)
      .where(eq(cities.city_id, cityId));
    return city;
  }

  static async createCity(cityName: string, branchId: number) {
    const newCity = await db
      .insert(cities)
      .values({ city_name: cityName, branch_id: branchId })
      .returning();
    return newCity;
  }

  static async updateCity(cityId: number, cityName: string) {
    const updatedCity = await db
      .update(cities)
      .set({ city_name: cityName })
      .where(eq(cities.city_id, cityId))
      .returning();
    return updatedCity;
  }

  static async deleteCity(cityId: number) {
    const deletedCity = await db
      .delete(cities)
      .where(eq(cities.city_id, cityId))
      .returning();
    return deletedCity;
  }
}
