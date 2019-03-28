require('dotenv').config()

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const compress = require('compression')

const app = express()

// middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser())
app.use(compress())
app.use(helmet())
app.use(cors())

//before router middleware 
// prevent CORS error
// app.use( (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*')
//     // res.header('Access-Control-Allow-Origin', 'https://my-page.com') //only my-page.com have access
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//         ); //which knid of header we anna access or to be sent
//     if(req.method === 'OPTIONS') { //browser send a OPTIONS request first when we send a POST or PUT request
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});   
//     }
// })

//test server
app.get('/test-server', (req, res) => {
  res.json('server ok')
})

// import routes
// const userRouter = require('')

// middleware to use routes
// app.use('/user', userRouter)

app.use((req, res, next) => { //this line is executing means no app.use middlewares above arre used
  const error = new Error('Not Found');
  error.status = 400;
  next(error);
})

app.use((error, req, res, next) => { // if above middleware throw an error
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})


module.exports = app