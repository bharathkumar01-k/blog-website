import z from "zod"

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string(),
    name:z.string().optional()
})
//@ts-ignore
export type singnupType = z.infer<typeof signupInput>;

export const signinInput = z.object({
    email:z.string().email(),
    password: z.string()
})
//@ts-ignore
export type signInType = z.infer<typeof signinInput>

export const createBlogInput = z.object({
    title:z.string(),
    content:z.string(),
    is_published:z.boolean()
})
//@ts-ignore
export type createBlogType = z.infer<typeof createBlogInput>

export const updateBlogInput = z.object({
    id:z.string(),
    title:z.string().optional(),
    content: z.string().optional(),
    is_published: z.boolean().optional()
})
//@ts-ignore
export type updateBlogType = z.infer<typeof updateBlogInput>