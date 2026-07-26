import { relations } from 'drizzle-orm';
import { pgTable, text, serial, integer, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const posts = pgTable('posts', {
  id: serial().primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  likes: integer("likes").notNull().default(0),
  userId: text("user_id").notNull().references(() => user.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const comments = pgTable('comments', {
  id: serial().primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id").notNull().references(() => user.id),
  postId: integer("post_id").notNull().references(() => posts.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(user, { fields: [posts.userId], references: [user.id] }),
  comments: many(comments),
}))

export const commentRelations = relations(comments, ({ one }) => ({
  user: one(user, { fields: [comments.userId], references: [user.id] }),
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
}))
