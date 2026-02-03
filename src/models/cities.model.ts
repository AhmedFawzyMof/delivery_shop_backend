import { db } from "../config/db";
import { branches, cities, driver } from "../config/db/schema";
import { and, eq } from "drizzle-orm";

export class CitiesModel {
  static async getAllCities(driverId?: number) {
    const conditions: any[] = [];

    if (driverId) {
      const branch_id = await db
        .select({ branch_id: branches.branch_id })
        .from(driver)
        .innerJoin(cities, eq(driver.driver_city, cities.city_name))
        .innerJoin(branches, eq(cities.branch_id, branches.branch_id))
        .where(eq(driver.driver_id, driverId))
        .get();

      if (branch_id) {
        conditions.push(eq(cities.branch_id, branch_id?.branch_id));
      }
    }
    const allCities = await db
      .select({
        city_id: cities.city_id,
        city_name: cities.city_name,
        branch_id: cities.branch_id,
      })
      .from(cities)
      .where(and(...conditions));

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
