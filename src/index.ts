import { Hono } from 'hono'
import { db } from './db'
import postRoutes from './router/post.route'
import { logger } from 'hono/logger'


const PORT = process.env.PORT || 3000

const app = new Hono()

app.use('*', logger())

app.get('/', (c) => c.json('API is running'))

app.route('/posts', postRoutes)



Bun.serve({
  port: PORT,
  fetch: app.fetch
})

if(process.env.NODE_ENV === 'development') {
  console.log(`Server is running on port http://localhost:${PORT}`)
}

export default app
