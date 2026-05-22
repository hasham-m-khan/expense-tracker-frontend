import { z } from "zod";

export const SigninSchema = z.object({
  email: z.email().min(1, "Email is required"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export type Signin = z.infer<typeof SigninSchema>;
