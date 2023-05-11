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
const rateRoute = require('./rate.js');
const cartRoute = require('./cart.js');
const orderRoute = require('./order.js');
function route(app) {
    // app.use(userName);
    app.use(sort);
    app.use('/auth', authRoute);
    app.use('/carts', authAccessToken, cartRoute);
    app.use('/rates', authAccessToken, rateRoute);
    app.use('/', authAccessToken, homeRoute);
    app.use('/branchs', authStaff, branchRoute);
    /* Private Route */
    app.use('/customers', customerRoute);
    app.use('/manage', authStaff, manageRoute);
    app.use('/staffs', authStaff, staffRoute);
    app.use('/stores', authStaff, storeRoute);
    app.use('/categories', authStaff, categoryRoute);
    app.use('/dishs', authStaff, dishRoute);
    app.use('/orders', authStaff, orderRoute);

    //  app.use('/customer', authStaff, customerRoute);
    app.use(notFound);
}
module.exports = route;
