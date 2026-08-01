import { Hono } from "hono";
import { createPost, deletePost, getPostById, getPosts, updatePost } from "../controller/post.controller";
import { Env } from "../types/hono";
import { requireAuth, sessionMiddleware } from "../middleware/auth.middleware";
import { zValidator } from "@hono/zod-validator";
import { CreatePostDto, UpdatePostDto } from "../dto/posts.dto";

const postRoutes = new Hono<Env>();

postRoutes.get("/", getPosts);
postRoutes.post("/", requireAuth, zValidator("json", CreatePostDto), createPost);
postRoutes.delete("/:id", requireAuth, deletePost);
postRoutes.put("/:id", requireAuth, zValidator("json", UpdatePostDto), updatePost);


export default postRoutes;
