import { app } from './app'
import mongoose from 'mongoose'
import { SocketManager } from './services/socketManager'
import 'dotenv/config'

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined')
    }

    // connect to database here
    await mongoose.connect(
      'mongodb+srv://Admin:ebewnO8vJqdoKnVp@neunerln.hipwzzh.mongodb.net/Neunerln?retryWrites=true&w=majority'
    )

    // initialize SocketManager
    new SocketManager().initialize()
  } catch (err) {
    // close server
    console.error(err)
  }

  app.listen(3000, () => {
    console.log('Server is listening on Port 3000.')
  })
}

start()
