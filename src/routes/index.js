const { notFound } = require('../middlewares/handleError.js');
const homeRoute = require('./home.js');
const authRoute = require('./auth.js');
const userRoute = require('./user.js');
function route(app) {
    app.use('/', homeRoute);
    app.use('/auth', authRoute);
    app.use('/user', userRoute);
    app.use(notFound);
}

module.exports = route;
