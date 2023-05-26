import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

// errors
import { NotFoundError } from './errors/not-found-error'

// middlewares
import { errorHandler } from './middlewares/error-handler'

// routes
import { signoutRouter } from './routes/signout'

// create server
var app = express()

/**
 * The code below will configure
 * the express server
 */

// app.set('trust proxy', true) only necessary if server sits behind a proxy

app.use(express.json()) // parse body

app.use(
  cookieSession({
    // store session data within a cookie
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

/**
 * Here are the primary routes of the app
 */
app.use(signoutRouter)
app.all('*', async () => {
  throw new NotFoundError()
})

/**
 * Error handling
 */
app.use(errorHandler)

// don't know if this breaks functionality above,
// but socket.io requires http module
app = require('http').Server(app);

export { app }
