import { Hono } from "hono";
import { getPosts } from "../controller/post.controller";

const postRoutes = new Hono();

postRoutes.get("/", getPosts);

export default postRoutes;
