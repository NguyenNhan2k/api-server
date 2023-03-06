const createError = require('http-errors');
const badRequest = (err, res) => {
    const error = createError.BadRequest(err, res);
    return res.status(error.statusCode).redirect('back');
};
const notFound = (req, res) => {
    const error = createError.NotFound('This route is not defined!');
    const errMessage = [
        {
            type: 'warning',
            mes: error.message,
        },
    ];
    req.flash('message', errMessage);
    return res.status(error.status).redirect('/auth/login');
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
