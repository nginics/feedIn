import { z } from "zod";

export const messageSchema = z.object({
    content: z.coerce
        .string()
        .min(10, "message must be atleast 10 characters")
        .max(300, "message can be atmost 300 characters"),
})