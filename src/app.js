const express = require('express')
const dotenv = require('dotenv')
const route = require('./api/routes')
const cookieParser = require('cookie-parser')
const cors = require('cors')


const app = express()
dotenv.config()
const port = process.env.PORT

app.use(cookieParser())
app.use(cors())
app.use(express.json())
// use routes
route(app)

// Connect database

app.listen(port, ()=> {
    console.log(`sever listening on port ${port}`)
})