import { comments, posts } from "./schema";
import { user } from "./auth-schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import * as authSchema from "./auth-schema";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, {
	schema: { ...schema, ...authSchema },
});

const main = async () => {
	try {
		console.log("Seeding database");
		// Delete all data
		await db.delete(comments);
		await db.delete(posts);
		await db.delete(user);

		await db.insert(user).values([
			{
				id: "user_1",
				name: "Alice Johnson",
				email: "alice.johnson@example.com",
			},
			{
				id: "user_2",
				name: "Bob Smith",
				email: "bob.smith@example.com",
			},
		]);

		await db.insert(posts).values([
			{
				id: 1,
				userId: "user_1",
				title: "Introduction",
				content: "Hello, World! Excited to join this community.",
			},
			{
				id: 2,
				userId: "user_2",
				title: "Reply",
				content: "Hello, Alice! Welcome to the community!",
			},
			{
				id: 3,
				userId: "user_1",
				title: "Reply",
				content: "Thanks, Bob! Glad to be here.",
			},
		]);

		await db.insert(comments).values([
			{
				id: 1,
				content: "Welcome, Alice! Looking forward to your posts.",
				userId: "user_2",
        postId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
			},
			{
				id: 2,
				content: "Thank you, Bob! Excited to be part of the conversation.",
				userId: "user_1",
				postId: 2,
			},
		]);
	} catch (error) {
		console.error(error);
		throw new Error("Failed to seed database");
	}
};

main();
