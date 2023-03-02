const createError = require('http-errors');
const badRequest = (req, res) => {
    const error = createError.BadRequest();
};
const notFound = (req, res) => {
    const error = createError.NotFound('This route is not defined!');
    return res.status(error.status).render('auth/login', {
        layout: 'main',
    });
};
const internalServer = (req, res) => {
    const error = createError.InternalServerError();
    return res.status(error.status).redirect('back');
};
module.exports = {
    badRequest,
    notFound,
    internalServer,
};
