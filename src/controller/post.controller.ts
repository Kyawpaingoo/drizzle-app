import { db } from "../db"
import { Context} from "hono"

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
