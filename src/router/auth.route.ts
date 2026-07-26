import { Hono } from "hono";
import { signUp, signIn, signOut } from "../controller/auth.controller";
import { zValidator } from "@hono/zod-validator";
import { SignUpUserDto, SignInUserDto } from "../dto/auth.dto";


const authRoutes = new Hono();

authRoutes.post("/signup", zValidator("json", SignUpUserDto), signUp);
authRoutes.post("/signin", zValidator("json", SignInUserDto), signIn);
authRoutes.post("/signout", signOut);

export default authRoutes;
