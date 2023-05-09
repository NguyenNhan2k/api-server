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
        const files = await req.files;
        try {
            const idRate = await req.params.idRate;
            const user = await req.user;
            if (!user) {
                return badRequest(req, res, messageError);
            }
            const { error, value } = await rateJoi.validate(req.body);
            if (error) {
                if (files.images) {
                    await removeArrImgForController(files.images);
                }
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await rateService.update(idRate, value, user, files);
            req.flash('message', response);
            res.redirect(`/branch/${response.branch.slug}`);
        } catch (error) {
            console.log(error);
            await removeArrImgForController(files.images);
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
}
module.exports = new RateController();
