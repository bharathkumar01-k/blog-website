import { Hono } from 'hono'
import {PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import userRouter from './router/userRouter';
import blogRouter from './router/blogRouter';


const app = new Hono<{
	Bindings: {
		DATABASE_NAME: string,
    JWT_SECRET: string
	},
  Variables:{
    userId: string
  }
}>();

app.use(
  '*',
  async (c, next) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_NAME || "no value",
    }).$extends(withAccelerate());
    //@ts-ignore
    c.set('prisma',prisma)
    console.log('prisma value set in middleware')
    await next();
  }
);


app.route('/api/v1/user', userRouter)

app.route('/api/v1/blog', blogRouter)


app.get('/', (c) => {
  return c.json({
    success:true,
    message:'The app is working properly..'
  })
})




export default app
