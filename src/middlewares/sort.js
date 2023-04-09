module.exports = function SortMiddleWare(req, res, next) {
    res.locals._sort = {
        enable: false,
        type: 'default',
    };
    res.locals._page = {
        enable: false,
        index: 1,
    };
    if (req.query.hasOwnProperty('page')) {
        Object.assign(res.locals._page, {
            enable: true,
            index: req.query.page,
        });
        console.log(req.query.page);
        Object.assign(res.locals._sort, {
            index: req.query.page,
        });
    }
    if (req.query.hasOwnProperty('_sort')) {
        Object.assign(res.locals._sort, {
            enable: true,
            type: req.query.type,
            column: req.query.column,
        });
    }
    next();
};
