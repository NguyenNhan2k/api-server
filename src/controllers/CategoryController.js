const { categoryJoi, categoryUpdateJoi } = require('../helpers/validateInput');
const categoryService = require('../services/CategoryService');
const { internalServer, badRequest } = require('../middlewares/handleError');
class CategorryController {
    async indexCategory(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const response = await categoryService.getAll({ page, order });
            const message = await req.flash('message')[0];
            return res.render('category/category', {
                layout: 'manage',
                active: 'staff',
                categories: response.categories,
                countPage: response.countPage,
                countDeleted: response.countDeleted,
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async indexCreate(req, res) {
        try {
            const message = await req.flash('message')[0];
            return res.status(200).render('category/createCategory', {
                layout: 'manage',
                message,
                active: 'categories',
            });
        } catch (error) {
            console.log(error);
            internalServer(req, res);
        }
    }
    async indexInfoCategory(req, res) {
        try {
            const idCategory = await req.params.id;
            if (!idCategory) {
                const messageError = 'Yêu cầu thất bại!';
                return badRequest(req, res, messageError);
            }
            const response = await categoryService.getOne(idCategory);
            const message = await req.flash('message')[0];
            return res.render('category/infoCategory', {
                layout: 'manage',
                category: response.err !== 1 ? response.category : {},
                active: 'staff',
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async indexTrash(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const deleted = false;
            const response = await categoryService.getAll({ page, order, deleted });
            const message = await req.flash('message')[0];
            return res.render('category/trashCategory', {
                layout: 'manage',
                active: 'Categories',
                categories: response.categories,
                countPage: response.countPage,
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async create(req, res) {
        try {
            const { error, value } = await categoryJoi.validate(req.body);
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await categoryService.create(value);
            req.flash('message', response);
            return res.status(200).redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async update(req, res) {
        try {
            const { error, value } = await categoryUpdateJoi.validate(req.body);
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await categoryService.update(value);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async destroy(req, res) {
        try {
            const categoryId = await req.params.id;
            if (!categoryId) {
                return badRequest(req, res, 'Yêu cầu thất bại!');
            }
            const response = await categoryService.destroy(categoryId);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async restore(req, res) {
        const message = {};
        try {
            const categoryID = await req.params.id;
            if (!categoryID) {
                const messageError = 'Yêu cầu thất bại!';
                return badRequest(req, res, messageError);
            }
            const response = await categoryService.restore(categoryID);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async force(req, res) {
        const message = {};
        try {
            const categoryId = await req.params.id;
            if (!categoryId) {
                const messageError = 'Yêu cầu thất bại!';
                return badRequest(req, res, messageError);
            }
            const response = await categoryService.force(categoryId);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async handelAction(req, res) {
        const message = {};
        try {
            const { actions, categories } = await req.body;

            if (!actions || categories.length < 0) {
                return badRequest(req, res, 'Input invalid !');
            }
            switch (actions) {
                case 'delete':
                    const resDeleted = await categoryService.destroyMutiple(categories);
                    req.flash('message', resDeleted);
                    res.redirect('back');
                    break;
                case 'restore':
                    const resRestore = await categoryService.restoreMutiple(categories);
                    req.flash('message', resRestore);
                    res.redirect('back');
                    break;
                case 'force':
                    const resForce = await categoryService.forceMutiple(categories);
                    req.flash('message', resForce);
                    res.redirect('back');
                    break;
                    defaults: message.mes = 'Action invalid !';
            }
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
}
module.exports = new CategorryController();
