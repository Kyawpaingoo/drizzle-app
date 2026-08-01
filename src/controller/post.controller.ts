import { db } from "../db"
import { Context} from "hono"
import { Env } from "../types/hono"
import { CreatePostDto, CreatePostDtoType, UpdatePostDto } from "../dto/posts.dto"
import { posts } from "../db/schema"
import { eq } from "drizzle-orm"

export const getPosts = async (c: Context) => {
  try {
    const data = await db.query.posts.findMany(
      {
        with: {
          comments: true,
          user: true
        }
      }
    )

    return c.json({
      data
    })
  } catch (error: any) {
    return c.json({
      error: error.message
    })
  }
}

export const getPostById = async (c: Context<Env>) => {
  try {
    const id = Number(c.req.param("id"))

    if(isNaN(id))
      return c.json({ error: "Invalid id" }, 400)

    const data = await db.query.posts.findFirst(
      {
        where: eq(posts.id, id),
        with: {
          comments: true,
          user: true
        }
      }
    )

    return c.json({
      data
    })
  }
  catch (error: any) {
    return c.json({
      error: error.message
    })
  }
}

export const createPost = async (c: Context<Env>) => {
  try {
    const user = c.get("user");

    const postData = CreatePostDto.safeParse(await c.req.json())

    if (!postData.success) {
        return c.json({ error: postData.error }, 400);
    }

    const [result] = await db.insert(posts).values({
      ...postData.data,
      userId: user!.id as string,
    }).returning()

    return c.json({
      result
    })
  }
  catch (error: any) {
    return c.json({
      error: error.message
    })
  }
}

export const updatePost = async (c: Context<Env>) => {
  try {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = Number(c.req.param("id"));

    if (isNaN(id)) {
      return c.json({ error: "Invalid id" }, 400);
    }

    const [existingPost] = await db.select().from(posts).where(eq(posts.id, id));

    if (!existingPost) {
      return c.json({ error: "Post not found" }, 404);
    }

    if (existingPost.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const postData = UpdatePostDto.safeParse(await c.req.json())

    if (!postData.success) {
        return c.json({ error: postData.error }, 400);
    }

    const [result] = await db.update(posts).set({
      ...postData.data,
    }).where(eq(posts.id, id)).returning()

    return c.json({
      result
    })
  }
  catch (error: any) {
    return c.json({
      error: error.message
    })
  }
}

export const deletePost = async (c: Context<Env>) => {
  try {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = Number(c.req.param("id"));

    if (isNaN(id)) {
      return c.json({ error: "Invalid id" }, 400);
    }

    const [existingPost] = await db.select().from(posts).where(eq(posts.id, id));

    if (!existingPost) {
      return c.json({ error: "Post not found" }, 404);
    }

    if (existingPost.userId !== user.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await db.delete(posts).where(eq(posts.id, id))

    return c.json({
      message: "Post deleted successfully"
    })
  }
  catch (error: any) {
    return c.json({
      error: error.message
    })
  }
}
