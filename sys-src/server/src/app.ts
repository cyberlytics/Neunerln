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
import { rankingRouter } from './routes/ranking'

// create server
var app = express()

/**
 * The code below will configure
 * the express server
 */

// app.set('trust proxy', true) only necessary if server sits behind a proxy
app.use(express.json()) // parse body

// Allow CORS from localhost
app.use(cors())

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
app.use(rankingRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

/**
 * Error handling
 */
app.use(errorHandler)

// socket.io requires a http.Server instance
// var fs = require('fs');
// var options = {
//   key: fs.readFileSync('<.key location>'),
//   cert: fs.readFileSync('<.cert location>')
// };
app = require('http').createServer(app)
// app = require('http').createServer(app)


export { app }
