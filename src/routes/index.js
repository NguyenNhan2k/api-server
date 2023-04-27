const { authAccessToken, authStaff, userName } = require('../middlewares/verifyToken');
const sort = require('../middlewares/sort.js');
const { notFound } = require('../middlewares/handleError.js');
const homeRoute = require('./home.js');
const authRoute = require('./auth.js');
const customerRoute = require('./customer.js');
const manageRoute = require('./manage.js');
const staffRoute = require('./staff.js');
function route(app) {
    // app.use(userName);
    app.use(sort);
    app.use('/', homeRoute);
    app.use('/auth', authRoute);

    /* Private Route */
    app.use(authAccessToken);
    app.use('/customers', customerRoute);
    app.use('/manage', authStaff, manageRoute);
    app.use('/staffs', authStaff, staffRoute);
    //  app.use('/customer', authStaff, customerRoute);

    app.use(notFound);
}
module.exports = route;
