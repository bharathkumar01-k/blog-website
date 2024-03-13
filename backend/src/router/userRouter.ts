import { Hono } from "hono";
import { sign } from 'hono/jwt';
import {signinInput,signupInput} from "@bharathk30/common-functions"

const userRouter = new Hono<{
    Bindings: {
        DATABASE_NAME: string,
        JWT_SECRET: string
    }
}>();

userRouter.post('/signup',async (c) => {
    // const prisma = new PrismaClient({
      // 	datasourceUrl: c.env?.DATABASE_NAME || "no value",
      // }).$extends(withAccelerate());
    const body = await c.req.json()
    const {success} = signupInput.safeParse(body)
    if(!success){
      c.status(411)
      return c.json({
        succes:false,
        message:"Validation Error"
      })
    }
    // const key = await crypto.subtle.generateKey(
    //   {
    //     name: "HMAC",
    //     hash: { name: "SHA-512" },
    //   },
    //   true,
    //   ["sign", "verify"],
    // );
    // const hashedPassword = await  crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body.password));
  
    // const rehased = new Uint8Array(hashedPassword);
    // console.log(rehased)
    // const result = await crypto.subtle.verify('HMAC', key,rehased, new TextEncoder().encode(body.password));
  
    try{
      //@ts-ignore
      const prisma = c.get('prisma')
      const user = await prisma.user.create({
        data:{
          name:body.name,
          email:body.email,
          password:body.password,
        }
      })
      console.log('user created',user)
    }catch(err){
      console.log("error in creating user",err)
      return c.json({
        success:false,
        message:'User already exists..'
      })
    }
    
    return c.json({
      success:true,
      message:'User created successfully..'
    })
  })
  
  userRouter.post('/signin',async (c) => {
    const body = await c.req.json()
    const {success} = signinInput.safeParse(body)
    if(!success){
      c.status(411)
      return c.json({
        succes:false,
        message:"Validation Error"
      })
    }
    //@ts-ignore
    const prisma = c.get('prisma')
    try{
      const user = await prisma.user.findUnique({
        where:{
          email:body.email
        }
      })
      if(!user && user.password !== body.password){
        c.status(403)
        return c.json({
          success:false,
          message:'User not found..'
        })
      }
  
      const jwt = await sign({
        id: user.id,
      },
      c.env.JWT_SECRET)
      return c.json({
        success:true,
        message:'User logged in successfully..',
        token:jwt
      })
    }catch(e){
      console.log(e)
      return c.json({
        success:false,
        message:'User not found..'
      })
    }
    
  })
export default userRouter;