import { z } from "zod";

export const SignUpUserDto = z.object({
  name: z.string().min(2, "Name msut be at least 2 characters"),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  image: z.string().optional(),
})

export const SignInUserDto = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const AuthUserResponseSchema = z.object({
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  id: z.string(),
})

export const AuthResponseBaseSchema = z.object({
  token: z.string(),
  user: AuthUserResponseSchema,
})

export const SignUpUserResponseDto = AuthResponseBaseSchema;

export const SignInUserResponseDto = AuthResponseBaseSchema.extend({
  redirect: z.boolean()
})

export type SignUpUserDtoType = z.infer<typeof SignUpUserDto>;

export type SignInUserDtoType = z.infer<typeof SignInUserDto>;

export type SignUpUserResponseDtoType = z.infer<typeof SignUpUserResponseDto>;

export type SignInUserResponseDtoType = z.infer<typeof SignInUserResponseDto>;
