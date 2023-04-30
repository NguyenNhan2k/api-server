const { authAccessToken, authStaff, userName } = require('../middlewares/verifyToken');
const sort = require('../middlewares/sort.js');
const { notFound } = require('../middlewares/handleError.js');
const homeRoute = require('./home.js');
const authRoute = require('./auth.js');
const customerRoute = require('./customer.js');
const manageRoute = require('./manage.js');
const staffRoute = require('./staff.js');
const storeRoute = require('./store.js');
const branchRoute = require('./branch.js');
const categoryRoute = require('./category.js');
const dishRoute = require('./dish.js');
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
    app.use('/stores', authStaff, storeRoute);
    app.use('/branchs', authStaff, branchRoute);
    app.use('/categories', authStaff, categoryRoute);
    app.use('/dishs', authStaff, dishRoute);

    //  app.use('/customer', authStaff, customerRoute);

    app.use(notFound);
}
module.exports = route;
