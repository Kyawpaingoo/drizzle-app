import { Hono } from 'hono'
import postRoutes from './router/post.route'
import { logger } from 'hono/logger'
import { auth } from './lib/auth'
import authRoutes from './router/auth.route'
import { sessionMiddleware } from './middleware/auth.middleware'

const app = new Hono()

app.use('*', logger())

app.get('/', (c) => c.json('API is running'))

app.use('*', sessionMiddleware);

app.route('/api/posts', postRoutes)
app.route('/api/auth', authRoutes)

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

if (typeof Bun !== 'undefined') {
  const PORT = process.env.PORT || 3000
  Bun.serve({
    port: PORT,
    fetch: app.fetch
  })
  console.log(`Server is running on port http://localhost:${PORT}`)
}

export default app
