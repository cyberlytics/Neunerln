import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import cors from 'cors'

// errors
import { NotFoundError } from './errors/not-found-error'

// middlewares
import { errorHandler } from './middlewares/error-handler'

// routes
import { signoutRouter } from './routes/signout'
import { signUpRouter } from './routes/signup'
import { signinRouter } from './routes/signin'

// create server
var app = express()

/**
 * The code below will configure
 * the express server
 */

// app.set('trust proxy', true) only necessary if server sits behind a proxy

// cors configuration
const whitelist = ['http://localhost:5173', 'http://localhost:3000']
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  app.use(cors(corsOptions))
}

app.use(express.json()) // parse body

// Allow CORS from localhost
app.use(
  cors({
    origin: 'http://localhost:5173/'
  })
)

app.use(
  cookieSession({
    // store session data within a cookie
    signed: false,
    secure: process.env.NODE_ENV === 'production' // should only be sent over https
  })
)

/**
 * Here are the primary routes of the app
 */
app.use(signoutRouter)
app.use(signUpRouter)
app.use(signinRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

/**
 * Error handling
 */
app.use(errorHandler)

// socket.io requires a http.Server instance
app = require('http').Server(app);

export { app }
