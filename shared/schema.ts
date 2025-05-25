import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  type: text("type").notNull().unique(), // 'terms-of-service', 'non-discrimination', 'payment-terms', 'privacy-policy'
  title: text("title").notNull(),
  content: text("content").notNull(),
  effectiveDate: text("effective_date").notNull(),
  lastUpdated: text("last_updated").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPolicySchema = createInsertSchema(policies).omit({
  id: true,
  createdAt: true,
});

export type InsertPolicy = z.infer<typeof insertPolicySchema>;
export type Policy = typeof policies.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
