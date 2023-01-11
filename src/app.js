const express = require('express')
const dotenv = require('dotenv')
const route = require('./api/routes')
const app = express()
dotenv.config()
const port = process.env.PORT || 3000
// use routes
route(app)
app.listen(port, ()=> {
    console.log(`sever listening on port ${port}`)
})