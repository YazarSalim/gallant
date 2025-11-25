
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;





export const clientSchema = z.object({
  clientCode: z.string().min(1, "Client Code is required"),
  clientName: z.string().min(1, "Client Name is required"),
  contact: z
    .string()
    .min(1, "Client Contact is required")
    .regex(/^\d+$/, "Contact must be a number"), 
});
