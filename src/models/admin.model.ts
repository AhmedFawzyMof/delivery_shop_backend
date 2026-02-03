import { db } from "../config/db";
import {
  admin,
  admin_branches,
  branches,
  cities,
  driver,
  order,
  restaurant,
  roles,
} from "../config/db/schema";
import { eq, and, or, sql, inArray } from "drizzle-orm";

export class AdminModel {
  static async getAll(branch_id: number, page: number) {
    const ITEMS_PER_PAGE = 25;
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const limit = ITEMS_PER_PAGE;

    const admins = await db
      .select({
        admin_id: admin.admin_id,
        admin_name: admin.admin_name,
        admin_email: admin.admin_email,
        admin_phone: admin.admin_phone,
        role_name: roles.role_name,
        role_id: roles.role_id,
        is_active: admin.is_active,
        created_at: admin.created_at,
      })
      .from(admin)
      .innerJoin(roles, eq(admin.role_id, roles.role_id))
      .innerJoin(admin_branches, eq(admin.admin_id, admin_branches.admin_id))
      .where(eq(admin_branches.branch_id, branch_id))
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${admin.created_at} DESC`)
      .all();

    const total_admins = await db
      .select({
        total_admins: sql<number>`COUNT(${admin.admin_id})`,
      })
      .from(admin)
      .get();

    return { admins, total_admins: total_admins?.total_admins };
  }

  static async getStats(from_date: string, to_date: string, cities: any) {
    const fromDateTime = from_date.includes(":")
      ? from_date
      : `${from_date} 00:00:00`;
    const toDateTime = to_date.includes(":") ? to_date : `${to_date} 23:59:59`;

    return db
      .select({
        order_count: sql<number>`COUNT(${order.order_id})`,
        orders_picked: sql<number>`COUNT(CASE WHEN ${order.order_status} IS NOT 'delivered' THEN 1 END)`,
        total_price: sql<number>`SUM(${order.order_delivery_cost})`,
        total_drivers: sql<number>`(
          SELECT COUNT(DISTINCT ${driver.driver_id}) 
          FROM ${driver} 
          WHERE ${driver.driver_status} = 'approved'
          AND ${inArray(driver.driver_city, cities)}
        )`,
        total_restaurants: sql<number>`(
          SELECT COUNT(DISTINCT ${restaurant.restaurant_id}) 
          FROM ${restaurant} 
          WHERE ${restaurant.is_baned} = 0
          AND ${inArray(restaurant.restaurant_city, cities)}
        )`,
      })
      .from(order)
      .leftJoin(
        restaurant,
        sql`${order.restaurant_id} = ${restaurant.restaurant_id}`
      )
      .where(
        and(
          sql`datetime(${order.created_at}) >= datetime(${fromDateTime})`,
          sql`datetime(${order.created_at}) <= datetime(${toDateTime})`,
          inArray(order.order_city, cities)
        )
      )
      .get();
  }

  static async getById(id: number) {
    const result = await db
      .select({
        admin_id: admin.admin_id,
        admin_name: admin.admin_name,
        admin_email: admin.admin_email,
        admin_phone: admin.admin_phone,
        is_active: admin.is_active,
        created_at: admin.created_at,
        role: {
          role_id: roles.role_id,
          role_name: roles.role_name,
          permissions: roles.permissions,
        },
        branches: {
          branch_id: branches.branch_id,
          branch_name: branches.branch_name,
          branch_address: branches.branch_address,
          city_name: cities.city_name,
        },
      })
      .from(admin)
      .leftJoin(roles, eq(admin.role_id, roles.role_id))
      .leftJoin(admin_branches, eq(admin.admin_id, admin_branches.admin_id))
      .leftJoin(branches, eq(admin_branches.branch_id, branches.branch_id))
      .leftJoin(cities, eq(branches.branch_id, cities.branch_id))
      .where(eq(admin.admin_id, id));

    return result;
  }

  static async create(data: typeof admin.$inferInsert, branch_id: number) {
    const result = await db.insert(admin).values(data).returning();
    await db
      .insert(admin_branches)
      .values({ admin_id: result[0].admin_id, branch_id });
  }

  static async update(id: number, data: Partial<typeof admin.$inferInsert>) {
    return await db
      .update(admin)
      .set(data)
      .where(eq(admin.admin_id, id))
      .returning();
  }

  static async delete(id: number) {
    return await db.delete(admin).where(eq(admin.admin_id, id)).returning();
  }

  static async login(identifier: string, password: string) {
    const foundAdmin = await db
      .select({
        admin_id: admin.admin_id,
        admin_name: admin.admin_name,
        admin_email: admin.admin_email,
        admin_phone: admin.admin_phone,
        is_active: admin.is_active,
        created_at: admin.created_at,
        role: {
          role_id: roles.role_id,
          role_name: roles.role_name,
          permissions: roles.permissions,
        },
        branches: {
          branch_id: branches.branch_id,
          branch_name: branches.branch_name,
          branch_address: branches.branch_address,
          city_name: cities.city_name,
        },
      })
      .from(admin)
      .leftJoin(roles, eq(admin.role_id, roles.role_id))
      .leftJoin(admin_branches, eq(admin.admin_id, admin_branches.admin_id))
      .leftJoin(branches, eq(admin_branches.branch_id, branches.branch_id))
      .leftJoin(cities, eq(branches.branch_id, cities.branch_id))
      .where(
        and(
          and(
            admin.is_active,
            or(
              eq(admin.admin_email, identifier),
              eq(admin.admin_phone, identifier)
            ),
            eq(admin.password, password)
          )
        )
      )
      .get();

    if (!foundAdmin?.admin_id) {
      throw new Error("Admin not found");
    }

    const adminRecord = foundAdmin;

    return { data: adminRecord };
  }
}
