const { storeJoi, storeUpdateJoi, baranchJoi, branchUpdateJoi } = require('../helpers/validateInput');
const orderService = require('../services/OrderService');
const { internalServer, badRequest } = require('../middlewares/handleError');
const { removeAvatarForController } = require('../helpers/manage');
class OrderController {
    async indexOrder(req, res) {
        try {
            const { type, column, page } = await req.query;
            const order = type && column ? [column, type] : [];
            const response = await orderService.getAll({ page, order });
            const message = await req.flash('message')[0];
            return res.render('order/order', {
                layout: 'manage',
                active: 'orders',
                orders: response.orders,
                countPage: response.countPage,
                countDeleted: response.countDeleted,
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async destroy(req, res) {
        try {
            const orderId = await req.params.id;
            if (!orderId) {
                return badRequest(req, res, 'Hành động thất bại !');
            }
            const response = await orderService.destroy(orderId);
            req.flash('message', response);
            res.redirect('back');
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
            const response = await orderService.getAll({ page, order, deleted });
            const message = await req.flash('message')[0];
            return res.render('order/trashOrder', {
                layout: 'manage',
                active: 'orders',
                orders: response.orders,
                countPage: response.countPage,
                message,
            });
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async handelAction(req, res) {
        const message = {};
        try {
            const { actions, orders } = await req.body;

            if (!actions || !orders) {
                return badRequest(req, res, 'Input invalid !');
            }
            switch (actions) {
                case 'delete':
                    const resDeleted = await orderService.destroyMutiple(orders);
                    req.flash('message', resDeleted);
                    res.redirect('back');
                    break;
                case 'restore':
                    const resRestore = await orderService.restoreMutiple(orders);
                    req.flash('message', resRestore);
                    res.redirect('back');
                    break;
                case 'force':
                    const resForce = await orderService.forceMutiple(orders);
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
    async restore(req, res) {
        const message = {};
        try {
            const orderId = await req.params.id;
            const response = await orderService.restore(orderId);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    //     async indexCreate(req, res) {
    //         try {
    //             const message = await req.flash('message')[0];
    //             const response = await orderService.indexCreate();
    //             return res.status(200).render('branch/createBranch', {
    //                 layout: 'manage',
    //                 message,
    //                 active: 'branchs',
    //                 stores: response.stores,
    //                 category: response.category,
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             internalServer(req, res);
    //         }
    //     }
    //     async create(req, res) {
    //         try {
    //             delete req.body.avatar;
    //             const { error, value } = await baranchJoi.validate(req.body);
    //             const file = await req.file;
    //             if (error) {
    //                 if (file) {
    //                     await removeAvatarForController(file);
    //                 }
    //                 const messageError = await error.details[0].message;
    //                 return badRequest(req, res, messageError);
    //             }
    //             const response = await orderService.create(value, file);
    //             req.flash('message', response);
    //             return res.status(200).redirect('back');
    //         } catch (error) {
    //             console.log(error);
    //             return internalServer(req, res);
    //         }
    //     }
    //     async indexInfoBranch(req, res) {
    //         try {
    //             const idBranch = await req.params.id;

    //             if (!idBranch) {
    //                 const messageError = 'Yêu cầu thất bại!';
    //                 return badRequest(req, res, messageError);
    //             }
    //             const response = await orderService.getOne(idBranch);
    //             const message = await req.flash('message')[0];
    //             return res.render('branch/infoBranch', {
    //                 layout: 'manage',
    //                 branch: response.err !== 1 ? response.branch : {},
    //                 active: 'branchs',
    //                 message,

    //                 stores: response.stores,
    //                 categories: response.categories,
    //                 price: response.price,
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             return internalServer(req, res);
    //         }
    //     }
    //     async indexTrash(req, res) {
    //         try {
    //             const { type, column, page } = await req.query;
    //             const order = type && column ? [column, type] : [];
    //             const deleted = false;
    //             const response = await orderService.getAll({ page, order, deleted });
    //             const message = await req.flash('message')[0];
    //             return res.render('branch/trashBranch', {
    //                 layout: 'manage',
    //                 active: 'branchs',
    //                 branchs: response.branchs,
    //                 countPage: response.countPage,
    //                 message,
    //             });
    //         } catch (error) {
    //             console.log(error);
    //             return internalServer(req, res);
    //         }
    //     }
    //     async update(req, res) {
    //         try {
    //             const { error, value } = await branchUpdateJoi.validate(req.body);
    //             const avatar = await req.file;
    //             if (error) {
    //                 if (avatar) {
    //                     await removeAvatarForController(file);
    //                 }
    //                 const messageError = await error.details[0].message;
    //                 return badRequest(req, res, messageError);
    //             }
    //             const response = await orderService.update(value, avatar);
    //             req.flash('message', response);
    //             res.redirect('back');
    //         } catch (error) {
    //             console.log(error);
    //             return internalServer(req, res);
    //         }
    //     }

    //     async restore(req, res) {
    //         const message = {};
    //         try {
    //             const branchId = await req.params.id;
    //             if (!branchId) {
    //                 return badRequest(req, res, 'Hành động thất bại !');
    //             }
    //             const response = await orderService.restore(storeId);
    //             req.flash('message', response);
    //             res.redirect('back');
    //         } catch (error) {
    //             console.log(error);
    //             return internalServer(req, res);
    //         }
    //     }
    //     async force(req, res) {
    //         const message = {};
    //         try {
    //             const branchId = await req.params.id;
    //             if (!branchId) {
    //                 return badRequest(req, res, 'Hành động thất bại !');
    //             }
    //             const response = await orderService.force(branchId);
    //             req.flash('message', response);
    //             res.redirect('back');
    //         } catch (error) {
    //             console.log(error);
    //             return internalServer(req, res);
    //         }
    //     }
    //     async handelAction(req, res) {
    //         const message = {};
    //         try {
    //             const { actions, branchs } = await req.body;

    //             if (!actions || !branchs) {
    //                 return badRequest(req, res, 'Input invalid !');
    //             }
    //             switch (actions) {
    //                 case 'delete':
    //                     const resDeleted = await orderService.destroyMutiple(branchs);
    //                     req.flash('message', resDeleted);
    //                     res.redirect('back');
    //                     break;
    //                 case 'restore':
    //                     const resRestore = await orderService.restoreMutiple(branchs);
    //                     req.flash('message', resRestore);
    //                     res.redirect('back');
    //                     break;
    //                 case 'force':
    //                     const resForce = await orderService.forceMutiple(branchs);
    //                     req.flash('message', resForce);
    //                     res.redirect('back');
    //                     break;
    //                     defaults: message.mes = 'Action invalid !';
    //             }
    //         } catch (error) {
    //             console.log(error);
    //             return internalServer(req, res);
    //         }
    //     }
    // }
}
module.exports = new OrderController();
