const { cartJoi } = require('../helpers/validateInput');
const cartService = require('../services/CartService');
const { internalServer, badRequest } = require('../middlewares/handleError');
const { removeArrImgForController, removeAvatarForController } = require('../helpers/manage');
class CartController {
    async create(req, res) {
        try {
            const user = await req.user;
            const idDish = await req.params.idDish;
            if (!user || !idDish) {
                return badRequest(req, res, 'Vui lòng đăng nhập để tiếp tục!');
            }
            let { error, value } = await cartJoi.validate({
                id_customer: user.id,
                id_dish: idDish,
                ...req.body,
            });

            if (error) {
                const messageError = await error.details[0].message;
                return badRequest(req, res, messageError);
            }
            const response = await cartService.create(value);
            req.flash('message', response);
            return res.status(200).redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    async update(req, res) {
        try {
            const idCart = await req.params.idCart;
            const user = await req.user;
            const carReq = await req.body;
            if (!idCart || !user || !carReq) {
                return badRequest(req, res, 'Hành động thất bại');
            }
            const response = await cartService.update(idCart, carReq);
            req.flash('message', response);
            res.redirect('/customers/cart');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    // async indexDish(req, res) {
    //     try {
    //         const { type, column, page } = await req.query;
    //         const order = type && column ? [column, type] : [];
    //         const response = await dishService.getAll({ page, order });
    //         const message = await req.flash('message')[0];
    //         return res.render('dish/dishs', {
    //             layout: 'manage',
    //             active: 'dishs',
    //             dishs: response.dishs,
    //             category: response.category,
    //             branch: response.branch,
    //             countPage: response.countPage,
    //             countDeleted: response.countDeleted,
    //             message,
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         return internalServer(req, res);
    //     }
    // }
    // async indexCreate(req, res) {
    //     try {
    //         const message = await req.flash('message')[0];
    //         const response = await dishService.indexCreate();
    //         return res.status(200).render('dish/createDish', {
    //             layout: 'manage',
    //             categories: response.categories,
    //             branchs: response.branchs,
    //             message,
    //             active: 'dishs',
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         internalServer(req, res);
    //     }
    // }
    // async indexUpdate(req, res) {
    //     try {
    //         const id = await req.params.id;
    //         if (!id) {
    //             return badRequest(req, res, 'Yêu cầu thất bại!');
    //         }
    //         const message = await req.flash('message')[0];
    //         const response = await dishService.getOne(id);
    //         return res.status(200).render('dish/updateDish', {
    //             layout: 'manage',

    //             dish: response.dish,
    //             categories: response.categories,
    //             branchs: response.branchs,
    //             message,
    //             active: 'dishs',
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         internalServer(req, res);
    //     }
    // }

    // async indexInfoDish(req, res) {
    //     try {
    //         const idDish = await req.params.id;
    //         if (!idDish) {
    //             const messageError = 'Yêu cầu thất bại!';
    //             return badRequest(req, res, messageError);
    //         }
    //         const response = await dishService.getOne(idDish);
    //         const message = await req.flash('message')[0];
    //         return res.render('dish/infoDish', {
    //             layout: 'manage',
    //             dish: response.err !== 1 ? response.dish : {},
    //             active: 'dishs',
    //             message,
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         return internalServer(req, res);
    //     }
    // }

    async destroy(req, res) {
        const message = {};
        try {
            const storeId = await req.params.id;

            const response = await dishService.destroy(storeId);
            req.flash('message', response);
            res.redirect('back');
        } catch (error) {
            console.log(error);
            return internalServer(req, res);
        }
    }
    // async restore(req, res) {
    //     const message = {};
    //     try {
    //         const dishId = await req.params.id;
    //         const response = await dishService.restore(dishId);
    //         req.flash('message', response);
    //         res.redirect('back');
    //     } catch (error) {
    //         console.log(error);
    //         return internalServer(req, res);
    //     }
    // }
    // async force(req, res) {
    //     const message = {
    //         err: 1,
    //         mes: 'Yêu cầu thất bại!',
    //         type: 'warning',
    //     };
    //     try {
    //         const dishsId = await req.params.id;
    //         const files = await req.files;
    //         if (!dishsId) {
    //             return message;
    //         }
    //         const response = await dishService.force(dishsId);
    //         req.flash('message', response);
    //         res.redirect('back');
    //     } catch (error) {
    //         console.log(error);
    //         return internalServer(req, res);
    //     }
    // }
    // async handelAction(req, res) {
    //     const message = {};
    //     try {
    //         const { actions, dishs } = await req.body;

    //         if (!actions || !dishs) {
    //             return badRequest(req, res, 'Input invalid !');
    //         }
    //         switch (actions) {
    //             case 'delete':
    //                 const resDeleted = await dishService.destroyMutiple(dishs);
    //                 req.flash('message', resDeleted);
    //                 res.redirect('back');
    //                 break;
    //             case 'restore':
    //                 const resRestore = await dishService.restoreMutiple(dishs);
    //                 req.flash('message', resRestore);
    //                 res.redirect('back');
    //                 break;
    //             case 'force':
    //                 const resForce = await dishService.forceMutiple(dishs);
    //                 req.flash('message', resForce);
    //                 res.redirect('back');
    //                 break;
    //                 defaults: message.mes = 'Action invalid !';
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return internalServer(req, res);
    //     }
    // }
}
module.exports = new CartController();
