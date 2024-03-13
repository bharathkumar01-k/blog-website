import { Hono } from "hono";
import { verify } from "hono/jwt";
import {createBlogInput,updateBlogInput} from "@bharathk30/common-functions"

const blogRouter = new Hono<{
    Bindings: {
        DATABASE_NAME: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string,
        prisma:any
    }
}>()

blogRouter.use('*', async (c, next) => {
    const token = c.req.header('Authorization') || '';
    const verification = await verify(token, c.env.JWT_SECRET)
    console.log('verification',verification)
    if (!verification) {
        return c.json({
            success: false,
            message: "Unauthorized",
        });
    }
    c.set('userId',verification.id)
    console.log('userId',c.req.path)
    await next();
})

blogRouter.post("/", async(c) => {
    console.log("userId", c.get('userId'))
    const body =await c.req.json();
    const {success} = createBlogInput.safeParse(body)
    if(!success){
      c.status(411)
      return c.json({
        succes:false,
        message:"Validation Error"
      })
    }
    console.log(body,c.get('userId'))
    try{
        //@ts-ignore
        const blog = await c.get('prisma').post.create({
            data:{
                title:body.title,
                content:body.content,
                published:body.is_published,
                author_id:c.get('userId')
            }
        })
        if(!blog){
            c.status(400)
            return c.json({
                success:false,
                message:'Not able to create blog'
            })
        }
        return c.json({
            success: true,
            message: "Blog created successfully..",
            blog_id:blog.id
        });
    }catch(err){
        console.log(err);
        return c.json({
            success:false,
            message:'Not able to create blog'
        })
    }
    
});

blogRouter.get("/bulk", async(c) => {
    enum Sort{
        asc = 1,
        desc = -1
    }
    let {page,size,sort} =  c.req.query();
    let pageNumber:number = +page;
    let limit:number = +size;
    let sortBy:string ;
    if(parseInt(sort) === Sort.asc){
        sortBy = "asc"
    }else if(parseInt(sort) === Sort.desc){
        sortBy = "desc"
    }
    if (!pageNumber) { 
        pageNumber = 1; 
    } 
    if (!limit) { 
        limit = 5; 
    } 
    const prisma = c.get('prisma')
    const count = await prisma.post.count();
    const allPosts = await prisma.post.findMany({
        skip: (pageNumber - 1) * limit,
        take: limit,
        select:{
            id:true,
            title:true,
            content:true,
            published:true,
            author:{
                select:{
                    name:true
                }
            }
        },
        orderBy:{
            // @ts-ignore
            title:sortBy
        }
    })

    return c.json({
        success: true,
        data:{
            total:count,
            page:+page,
            size:+size,
            posts:allPosts
        }
    });
});

blogRouter.get('/get_post_by_id/:id',async (c) => {
    const post_id = c.req.param('id')
    console.log('inside id',post_id)
    try{
        const post = await c.get('prisma').post.findUnique({
            where:{
                id: post_id
            },
            select:{
                id:true,
                title:true,
                content:true,
                published:true,
                author:{
                    select:{
                        name:true
                    }
                }
            }
        })
        return c.json({
            success: true,
            result: post
        });
    }catch(e){
        console.log(e)
        c.status(403)
        return c.json({
            success:false,
            message:"Error in fetching post"
        })
    }
    
});

blogRouter.post('/update_blog',async(c) => {
    const body = await c.req.json()
    const {success} = updateBlogInput.safeParse(body)
    if(!success){
      c.status(411)
      return c.json({
        succes:false,
        message:"Validation Error"
      })
    }
    const prisma = c.get('prisma')
    const blog = await prisma.post.update({
        where:{
            id:body.id
        },
        data:{
            title:body.title,
            content:body.content,
            published:body.is_published
        }
    })
    if(blog){
        return c.json({
            success:true,
            message:"Blog updated successfully"
        })
    }
    return c.json({
        success:false,
        message:"Error in updating blog"
    })
})


// blogRouter.get('/:id', async (c) => {
//     const id = c.req.param("id");
//     const prisma = c.get('prisma');

//     try {
//         const blog = await prisma.post.findFirst({
//             where: {
//                 id: id
//             },
//             select: {
//                 id: true,
//                 title: true,
//                 content: true,
//                 author: {
//                     select: {
//                         name: true
//                     }
//                 }
//             }
//         })
    
//         return c.json({
//             blog
//         });
//     } catch(e) {
//         console.log(e)
//         c.status(411); // 4
//         return c.json({
//             message: "Error while fetching blog post"
//         });
//     }
// })



export default blogRouter;
