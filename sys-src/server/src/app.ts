import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'

// create server
const app = express()

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

/**
 * Error handling
 */

export { app }
