import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const restaurant = sqliteTable("restaurant", {
  restaurant_id: integer("restaurant_id").primaryKey({ autoIncrement: true }),
  restaurant_name: text("restaurant_name"),
  restaurant_city: text("restaurant_city"),
  logo_image: text("logo_image"),
  address: text("address"),
  location: text("location"),
  commercial_register: text("commercial_register"),
  password: text("password"),
  is_baned: integer("is_banned", { mode: "boolean" }).default(true),
  rate: integer("rate"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const driver = sqliteTable("driver", {
  driver_id: integer("driver_id").primaryKey({ autoIncrement: true }),
  driver_full_name: text("driver_full_name"),
  driver_phone: text("driver_phone"),
  driver_city: text("driver_city"),
  driver_type: text("driver_type"),
  driver_status: text("driver_status").default("pending"),
  is_baned: integer("is_banned", { mode: "boolean" }).default(false),
  stationed_at: integer("stationed_at").references(
    () => restaurant.restaurant_id
  ),
  id_number: text("id_number"),
  plate_number: text("plate_number"),
  first_license_photo: text("first_license_photo"),
  second_license_photo: text("second_license_photo"),
  third_license_photo: text("third_license_photo"),
  fourth_license_photo: text("fourth_license_photo"),
  password: text("password"),
  rate: integer("rate"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  freelancer: integer("freelancer", { mode: "boolean" }).default(false),
  shift_duration: integer("shift_duration").default(10),
});

export const driver_login_record = sqliteTable("driver_login_record", {
  login_record_id: integer("login_record_id").primaryKey({
    autoIncrement: true,
  }),
  driver_image: text("driver_image"),
  driver_id: integer("driver_id").references(() => driver.driver_id, {
    onDelete: "cascade",
  }),
  login_time: text("login_time"),
  shift_start_time: text("shift_start_time"),
  shift_end_time: text("shift_end_time"),
});

export const user = sqliteTable("user", {
  user_id: integer("user_id").primaryKey({ autoIncrement: true }),
  user_name: text("user_name"),
  user_phone: text("user_phone"),
  user_address: text("user_address"),
  restaurant_id: integer("restaurant_id").references(
    () => restaurant.restaurant_id,
    {
      onDelete: "cascade",
    }
  ),
});

export const order = sqliteTable("order", {
  order_id: integer("order_id").primaryKey({ autoIncrement: true }),
  order_total_price: integer("order_total_price"),
  order_delivery_cost: integer("order_delivery_cost"),
  order_status: text("order_status"),
  order_receipt: text("order_receipt"),
  order_city: text("order_city"),
  pickup_image: text("pickup_image"),
  order_notes: text("order_notes"),
  user_id: integer("user_id").references(() => user.user_id),
  driver_id: integer("driver_id").references(() => driver.driver_id),
  restaurant_id: integer("restaurant_id").references(
    () => restaurant.restaurant_id
  ),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  ready_at: text("ready_at"),
  picked_up_at: text("picked_up_at"),
  delivered_at: text("delivered_at"),
});

export const cities = sqliteTable("cities", {
  city_id: integer("city_id").primaryKey({ autoIncrement: true }),
  city_name: text("city_name"),
  branch_id: integer("branch_id").references(() => branches.branch_id),
});

export const roles = sqliteTable("roles", {
  role_id: integer("role_id").primaryKey({ autoIncrement: true }),
  role_name: text("role_name"),
  description: text("description"),
});

export const admin = sqliteTable("admin", {
  admin_id: integer("admin_id").primaryKey({ autoIncrement: true }),
  admin_name: text("admin_name"),
  admin_email: text("admin_email"),
  admin_phone: text("admin_phone"),
  password: text("password"),
  role_id: integer("role_id").references(() => roles.role_id),
  is_active: integer("is_active", { mode: "boolean" }).default(true),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const branches = sqliteTable("branches", {
  branch_id: integer("branch_id").primaryKey({ autoIncrement: true }),
  branch_name: text("branch_name"),
  branch_address: text("branch_address"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const admin_branches = sqliteTable("admin_branches", {
  admin_branch_id: integer("admin_branch_id").primaryKey({
    autoIncrement: true,
  }),
  admin_id: integer("admin_id").references(() => admin.admin_id, {
    onDelete: "cascade",
  }),
  branch_id: integer("branch_id").references(() => branches.branch_id, {
    onDelete: "cascade",
  }),
});

export const contact = sqliteTable("contact", {
  contact_id: integer("contact_id").primaryKey({ autoIncrement: true }),
  contact_name: text("contact_name"),
  contact_phone: text("contact_phone"),
  contact_message: text("contact_message"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
