import z from "zod";
export declare const signupInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    name?: string | undefined;
}>;
export type singnupType = z.infer<typeof signupInput>;
export declare const signinInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type signInType = z.infer<typeof signinInput>;
export declare const createBlogInput: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    is_published: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    is_published: boolean;
}, {
    title: string;
    content: string;
    is_published: boolean;
}>;
export type createBlogType = z.infer<typeof createBlogInput>;
export declare const updateBlogInput: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    is_published: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title?: string | undefined;
    content?: string | undefined;
    is_published?: boolean | undefined;
}, {
    id: string;
    title?: string | undefined;
    content?: string | undefined;
    is_published?: boolean | undefined;
}>;
export type updateBlogType = z.infer<typeof updateBlogInput>;
