import { z } from "zod";

export const CreatePostDto = z.object({
  title: z.string().min(2, "title must be at least 2 characters"),
  content: z.string().min(1, "content must be at least 1 character")
});

export const UpdatePostDto = z.object({
  title: z.string().min(2, "title must be at least 2 characters"),
  content: z.string().min(1, "content must be at least 1 character")
})

export type CreatePostDtoType = z.infer<typeof CreatePostDto>;
