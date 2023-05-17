import { app } from './app'

const start = async () => {
  try {
    // connect to database here
  } catch (err) {
    // close server
    app.close(() => {
      console.error(err)
      process.exit(0)
    })
  }

  app.listen(3000, () => {
    console.log('Server is listening on Port 3000.')
  })
}

start()
