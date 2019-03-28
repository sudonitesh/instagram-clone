require('dotenv').config()
config = {
    env:                 process.env.NODE_ENV,
    port:                process.env.PORT,
    jwtSecret:           process.env.JWT_SECRET,
    mongoUri:            process.env.MONGODB_URI,
    tokenExpireTime:     process.env.TOKEN_EXPRIES_TIME
}
module.exports = config