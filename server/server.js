const mongoose = require('mongoose')

const config = require('./config/config')
const app = require('./express')

// db connect
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true 
  }, ()=> {
  console.log('[+] db connected')
})
mongoose.Promise = global.Promise
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to db: ${config.mongoUri}`)
})

app.listen(config.port, (err) => {
  if (err) {
    console.error(err)
  }
  console.info('[+] Server started on port %s.', config.port)
})
