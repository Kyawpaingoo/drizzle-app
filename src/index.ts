import { Hono } from 'hono'
import postRoutes from './router/post.route'
import { logger } from 'hono/logger'
import { auth } from './lib/auth'

const app = new Hono()

app.use('*', logger())

app.get('/', (c) => c.json('API is running'))

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.route('/posts', postRoutes)

// Bun.serve is only used for local `bun run` dev; Cloudflare Workers
// invokes the default-exported fetch handler directly instead.
if (typeof Bun !== 'undefined') {
  const PORT = process.env.PORT || 3000
  Bun.serve({
    port: PORT,
    fetch: app.fetch
  })
  console.log(`Server is running on port http://localhost:${PORT}`)
}

export default app
