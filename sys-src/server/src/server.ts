import { app } from './app'
import mongoose from 'mongoose'

const start = async () => {
  try {
    // connect to database here
    await mongoose.connect(
      "mongodb+srv://Admin:ebewnO8vJqdoKnVp@neunerln.hipwzzh.mongodb.net/?retryWrites=true&w=majority"
    );
  } catch (err) {
    console.error(err)
  }

  app.listen(3000, () => {
    console.log('Server is listening on Port 3000.')
  })
}

start()
