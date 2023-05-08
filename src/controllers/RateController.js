const { rateJoi } = require('../helpers/validateInput');
const rateService = require('../services/RateService');
const { internalServer, badRequest } = require('../middlewares/handleError');
const { removeArrImgForController, removeAvatarForController } = require('../helpers/manage');
class RateController {
    async create(req, res) {
        try {
            const files = await req.files;
            const idBranch = await req.params.id;
            const { id } = await req.user;
            if (!idBranch || !id) {
                return badRequest(req, res, 'Yêu cầu thất bại!');
            }
            let { error, value } = await rateJoi.validate(req.body);
            if (error) {
                if (files) {
                    await removeArrImgForController(files);
                }
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            value.id_branch = await idBranch;
            value.id_customer = await id;

            const response = await rateService.create(value, files);
            req.flash('message', response);
            return res.status(200).redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async update(req, res) {
        try {
            const id = await req.params.id;
            const files = await req.files;
            const { error, value } = await dishJoi.validate(req.body);
            if (error) {
                if (files.avatar) {
                    await removeAvatarForController(files.avatar[0]);
                }
                if (files.images) {
                    await removeArrImgForController(files.images);
                }
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await rateService.update(id, value, files);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async destroy(req, res) {
        const message = {};
        try {
            const storeId = await req.params.id;

            const response = await rateService.destroy(storeId);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async force(req, res) {
        const message = {
            err: 1,
            mes: 'Yêu cầu thất bại!',
            type: 'warning',
        };
        try {
            const dishsId = await req.params.id;
            const files = await req.files;
            if (!dishsId) {
                return message;
            }
            const response = await rateService.force(dishsId);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
}
module.exports = new RateController();
