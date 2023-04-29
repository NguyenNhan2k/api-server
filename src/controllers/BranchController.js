const { storeJoi, storeUpdateJoi, baranchJoi, branchUpdateJoi } = require('../helpers/validateInput');
const branchService = require('../services/BranchService');
const { internalServer, badRequest } = require('../middlewares/handleError');

class BranchController {
    async indexBranch(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const response = await branchService.getAll({ page, order });
            console.log(response);
            const message = await req.flash('message')[0];
            return res.render('branch/branch', {
                layout: 'manage',
                active: 'branchs',
                branchs: response.branchs,
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
            const response = await branchService.indexCreate();
            return res.status(200).render('branch/createBranch', {
                layout: 'manage',
                message,
                active: 'branchs',
                stores: response.stores,
            });
        } catch (error) {
            console.log(error);
            internalServer(req, res);
        }
    }
    async create(req, res) {
        try {
            delete req.body.avatar;
            const { error, value } = await baranchJoi.validate(req.body);
            const file = await req.file;
            console.log(value, file);
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }

            const response = await branchService.create(value, file);
            req.flash('message', response);
            return res.status(200).redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async indexInfoBranch(req, res) {
        try {
            const idBranch = await req.params.id;
            if (!idBranch) {
                const messageError = 'Yêu cầu thất bại!';
                return badRequest(req, res, messageError);
            }
            const response = await branchService.getOne(idBranch);
            const message = await req.flash('message')[0];
            console.log(response);
            return res.render('branch/infoBranch', {
                layout: 'manage',
                branch: response.err !== 1 ? response.branch : {},
                active: 'branchs',
                message,
                stores: response.stores,
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
            const response = await branchService.getAll({ page, order, deleted });
            const message = await req.flash('message')[0];
            return res.render('branch/trashBranch', {
                layout: 'manage',
                active: 'branchs',
                branchs: response.branchs,
                countPage: response.countPage,
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async update(req, res) {
        try {
            delete req.body.avatar;
            const { error, value } = await branchUpdateJoi.validate(req.body);
            const avatar = await req.file;
            console.log(avatar);
            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await branchService.update(value, avatar);
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
            const branchId = await req.params.id;
            if (!branchId) {
                return badRequest(req, res, 'Hành động thất bại !');
            }
            const response = await branchService.destroy(branchId);
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
            const branchId = await req.params.id;
            if (!branchId) {
                return badRequest(req, res, 'Hành động thất bại !');
            }
            const response = await branchService.restore(storeId);
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
            const branchId = await req.params.id;
            if (!branchId) {
                return badRequest(req, res, 'Hành động thất bại !');
            }
            const response = await branchService.force(branchId);
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
            const { actions, branchs } = await req.body;

            if (!actions || !branchs) {
                return badRequest(req, res, 'Input invalid !');
            }
            switch (actions) {
                case 'delete':
                    const resDeleted = await branchService.destroyMutiple(branchs);
                    req.flash('message', resDeleted);
                    res.redirect('back');
                    break;
                case 'restore':
                    const resRestore = await branchService.restoreMutiple(branchs);
                    req.flash('message', resRestore);
                    res.redirect('back');
                    break;
                case 'force':
                    const resForce = await branchService.forceMutiple(branchs);
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
module.exports = new BranchController();
