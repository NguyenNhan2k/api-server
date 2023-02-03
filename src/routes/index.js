const homeRoute = require('./home.js')
const authRoute = require('./auth.js')
function route (app) {
    app.use('/home', homeRoute)
    app.use('/home', authRoute)
}

module.exports = route