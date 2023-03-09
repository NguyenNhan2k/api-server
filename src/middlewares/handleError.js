const createError = require('http-errors');

const badRequest = (req, res, err) => {
    const error = createError.BadRequest(err);
    const errMessage = [
        {
            type: 'warning',
            mes: error.message,
        },
    ];
    req.flash('message', errMessage);
    res.redirect('/auth/login');
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
    return res.redirect('/auth/login');
};

const unauthorized = (req, res, err) => {
    const error = createError.Unauthorized(err, res);
    const response = [
        {
            type: 'warning',
            mes: error.message,
        },
    ];
    req.flash('message', response);
    return res.redirect('/auth/login');
};

const internalServer = (req, res) => {
    const error = createError.InternalServerError();
    const response = [
        {
            type: 'warning',
            mes: error.message,
        },
    ];
    req.flash('message', response);
    res.redirect('back');
};

module.exports = {
    badRequest,
    notFound,
    internalServer,
    unauthorized,
};
