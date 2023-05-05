const { customerJoi, userJoi, storeJoi, storeUpdateJoi } = require('../helpers/validateInput');
const storeService = require('../services/StoreService');
const { internalServer, badRequest } = require('../middlewares/handleError');
const { removeAvatarForController } = require('../helpers/manage');
class StoreController {
    async indexStore(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const response = await storeService.getAll({ page, order });
            const message = await req.flash('message')[0];
            return res.render('store/stores', {
                layout: 'manage',
                active: 'stores',
                stores: response.stores,
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
            return res.status(200).render('store/createStore', {
                layout: 'manage',
                message,
                active: 'stores',
            });
        } catch (error) {
            console.log(error);
            internalServer(req, res);
        }
    }
    async indexUpdate(req, res) {
        try {
            const message = await req.flash('message')[0];
            const id = await req.params.id;
            if (!id) {
                badRequest(req, res, 'Yêu cầu thất bại!');
            }
            const response = await storeService.getOne(id);
            return res.status(200).render('store/updateStore', {
                layout: 'manage',
                active: 'stores',
                store: response.store,
                message,
            });
        } catch (error) {
            console.log(error);
            internalServer(req, res);
        }
    }
    async create(req, res) {
        try {
            const { error, value } = await storeJoi.validate(req.body);
            const file = await req.file;
            if (error) {
                if (file) {
                    await removeAvatarForController(file);
                }
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await storeService.create(value, file);
            req.flash('message', response);
            return res.status(200).redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async indexInfoStore(req, res) {
        try {
            const idStore = await req.params.id;
            if (!idStore) {
                const messageError = 'Yêu cầu thất bại!';
                return badRequest(req, res, messageError);
            }
            const response = await storeService.getOne(idStore);
            const message = await req.flash('message')[0];
            return res.render('store/infoStore', {
                layout: 'manage',
                store: response.err !== 1 ? response.store : {},
                active: 'stores',
                countImg: response.countImg,
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
            const response = await storeService.getAll({ page, order, deleted });
            const message = await req.flash('message')[0];
            return res.render('store/trashStore', {
                layout: 'manage',
                active: 'stores',
                stores: response.stores,
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
            const { error, value } = await storeUpdateJoi.validate(req.body);
            const file = await req.file;
            const id = await req.params.id;
            if (error || !id) {
                if (file) {
                    await removeAvatarForController(file);
                }
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await storeService.update({ id, ...value }, file);
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

            const response = await storeService.destroy(storeId);
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
            const storeId = await req.params.id;
            const response = await storeService.restore(storeId);
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
            const storeId = await req.params.id;
            const response = await storeService.force(storeId);
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
            const { actions, stores } = await req.body;

            if (!actions || !stores) {
                return badRequest(req, res, 'Input invalid !');
            }
            switch (actions) {
                case 'delete':
                    const resDeleted = await storeService.destroyMutiple(stores);
                    req.flash('message', resDeleted);
                    res.redirect('back');
                    break;
                case 'restore':
                    const resRestore = await storeService.restoreMutiple(stores);
                    req.flash('message', resRestore);
                    res.redirect('back');
                    break;
                case 'force':
                    const resForce = await storeService.forceMutiple(stores);
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
module.exports = new StoreController();
