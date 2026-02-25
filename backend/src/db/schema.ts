import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
    id: text("id").primaryKey(),
    name: text("name"),
    email: text("email").notNull().unique(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const products = pgTable("products", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    imageUrl: text("image_url").notNull(),
    userId : text("user_id").notNull().references(() => users.id, {onDelete : "cascade"}),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().defaultRandom(),
    content: text("content").notNull(),
    userId : text("user_id").notNull().references(() => users.id, {onDelete : "cascade"}),
    productId : uuid("product_id").notNull().references(() => products.id, {onDelete : "cascade"}),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// user have many products and many comments
export const usersRelations = relations(users, ({ many }) => ({
    products: many(products), // one user can have many products
    comments: many(comments), // one user can have many comments
}));

// a product belongs to one user and has many comments
export const productsRelations = relations(products, ({ one, many }) => ({
    user: one(users, {fields: [products.userId], references: [users.id]}), // one product belongs to one user
    comments: many(comments), // one product can have many comments
}));

// a comment belongs to one user and one product
export const commentsRelations = relations(comments, ({ one }) => ({
    user: one(users, {fields: [comments.userId], references: [users.id]}), // one comment belongs to one user
    product: one(products, {fields: [comments.productId], references: [products.id]}), // one comment belongs to one product
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;