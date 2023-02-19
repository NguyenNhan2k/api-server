const homeRoute = require('./home.js');
const authRoute = require('./auth.js');
function route(app) {
    app.use('/', homeRoute);
    app.use('/auth', authRoute);
}

module.exports = route;
