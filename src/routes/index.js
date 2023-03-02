const { notFound } = require('../middlewares/handleError.js');
const homeRoute = require('./home.js');
const authRoute = require('./auth.js');
function route(app) {
    app.use('/', homeRoute);
    app.use('/auth', authRoute);

    app.use(notFound);
}

module.exports = route;
