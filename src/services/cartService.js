const fs = require('fs-extra');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

const db = require('../models');
const { removeArrImgInFolder, removeAvatarInFolder, checkOpenStore } = require('../helpers/manage');
class CartService {
    async create(payload) {
        var message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const { id_customer, id_dish, quanlity } = await payload;
            const customer = await db.Customers.findOne({ where: { id: id_customer }, raw: true });
            const dish = await db.Dishs.findOne({
                where: { id: id_dish },
                raw: true,
                nest: true,
                include: {
                    model: db.Branchs,
                    as: 'branch',
                    raw: true,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            });

            //1. Kiểm tra id món ăn có tồn tại
            if (!dish) {
                return message;
            }
            //2. Kiểm tra quán đã đóng hay mở
            const isOpen = await checkOpenStore(dish.branch.startTime, dish.branch.endTime);
            if (!isOpen) {
                message.mes = await 'Cửa hàng đã đóng cửa!';
                return message;
            }
            //3. Tạo giỏ hàng
            //3.1 Nếu có giỏ hàng khách hàng --> Tạo mới giỏ hàng và chi tiết giỏ hàng
            const salePrice = await ((parseInt(dish.price) * parseInt(dish.sale)) / 100);
            const totalCartDetail = (await (dish.price - salePrice)) * quanlity;
            let convertCart;
            let [cart, created] = await db.Carts.findOrCreate({
                raw: true,
                where: { id_customer },
                defaults: {
                    id_branch: dish.branch.id,
                    total: 0,
                    id_customer,
                },
            });
            if (created) {
                convertCart = await cart.toJSON();
            } else {
                convertCart = await cart;
            }
            const updateCart = await db.Carts.update(
                { total: totalCartDetail + convertCart.total },
                { where: { id: convertCart.id } },
            );
            const [cartDetail, createdDetail] = await db.CartDetails.findOrCreate({
                raw: true,
                where: { id: id_dish },
                defaults: {
                    id_cart: convertCart.id,
                    id_dish: dish.id,
                    total: totalCartDetail,
                    quanlity,
                },
            });
            if (!createdDetail) {
                const updateDetailCart = await db.CartDetails.update(
                    { quanlity: cartDetail.quanlity + quanlity, total: cartDetail.total + totalCartDetail },
                    { where: { id: cartDetail.id } },
                );
            }
            return (message = {
                err: 1,
                mes: 'Thêm vào giỏ hàng thành công!',
                type: 'success',
                customer,
                cart: convertCart,
            });
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async update(idCart, payload) {
        let message = {
            err: 1,
            type: 'warning',
            mes: 'Update cart fail !',
        };
        try {
            const { id_dish, quanlity } = await payload;
            const cart = await db.Carts.findOne({
                nest: true,
                where: { id: idCart },
                include: {
                    model: db.Customers,
                    as: 'customer',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            }).then((result) => result.toJSON());
            if (!cart) {
                return message;
            }

            //Xóa hết món ăn trong giỏ hàng
            if (!payload.quanlity) {
                const deletedCartDetail = await db.CartDetails.destroy({ where: { id_cart: cart.id }, force: true });
                const deletedCart = await db.Carts.destroy({ where: { id: cart.id }, force: true });
                return (message = {
                    err: 0,
                    type: 'success',
                    mes: 'Update store successfully!',
                });
            }
            // Xóa hết cart detail

            if (payload) {
                const deletedCartDetail = await db.CartDetails.destroy({ where: { id_cart: cart.id }, force: true });
                let totalCart = 0;

                for (let i = 0; i < quanlity.length; i++) {
                    const converQuanlity = await parseInt(quanlity[i]);
                    const dishModel = await db.Dishs.findOne({ where: { id: id_dish[i] }, raw: true });
                    const salePrice = (await (parseInt(dishModel.price) * parseInt(dishModel.sale))) / 100;
                    const totalCartDetail = (await (dishModel.price - salePrice)) * converQuanlity;
                    totalCart += await totalCartDetail;
                    const creatCartDetail = await db.CartDetails.create({
                        id_customer: cart.customer.id,
                        id_dish: id_dish[i],
                        id_cart: cart.id,
                        total: totalCartDetail,
                        quanlity: quanlity[i],
                    });
                }
                console.log(totalCart);
                const updateCart = await db.Carts.update({ total: totalCart }, { where: { id: cart.id } });
                return (message = {
                    err: 0,
                    mes: 'Cập nhật giỏ hàng thành công!',
                    type: 'success',
                });
            }
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async indexCreate() {
        let message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const categories = await db.Categories.findAll({ raw: true });
            const branchs = await db.Branchs.findAll({ raw: true });
            if (!categories || !branchs) {
                return message;
            }
            return (message = {
                err: 0,
                mes: 'Hành động thành công!',
                type: 'success',
                categories,
                branchs,
            });
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async findOne(id, deleted = true) {
        try {
            const queries = await {
                where: { id },
                include: [
                    {
                        model: db.Categories,
                        as: 'category',
                        raw: true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.Branchs,
                        as: 'branch',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.Images,
                        as: 'image',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                ],
                raw: false,
                nest: true,
            };
            if (!deleted) {
                (queries.where = await {
                    destroyTime: {
                        [op.not]: null,
                    },
                }),
                    (queries.paranoid = deleted);
            }
            const dish = await db.Dishs.findOne({
                ...queries,
            });
            return dish.toJSON();
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async findAll(arrId, deleted = true) {
        try {
            const queries = await {
                where: { id: arrId },
                include: [
                    {
                        model: db.Categories,
                        as: 'category',
                        raw: true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.Branchs,
                        as: 'branch',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.Images,
                        as: 'image',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                ],
                raw: false,
                nest: true,
            };
            if (!deleted) {
                (queries.where = await {
                    destroyTime: {
                        [op.not]: null,
                    },
                }),
                    (queries.paranoid = deleted);
            }
            const dishs = await db.Dishs.findAll({
                ...queries,
            });
            const newDishs = await dishs.map((dish) => {
                return dish.toJSON();
            });
            return newDishs;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async getOne(id) {
        let message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            if (!id) {
                return message;
            }
            const categories = await db.Categories.findAll({ raw: true });
            const branchs = await db.Branchs.findAll({ raw: true });
            const dish = await db.Dishs.findOne({
                where: { id },
                include: [
                    {
                        model: db.Categories,
                        as: 'category',
                        raw: true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.Branchs,
                        as: 'branch',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.Images,
                        as: 'image',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                ],
                raw: false,
                nest: true,
            }).then((result) => {
                return result.toJSON();
            });
            if (dish) {
                return (message = {
                    err: 0,
                    mes: 'Hành động thành công!',
                    type: 'success',
                    dish,
                    categories,
                    branchs,
                });
            }
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async getAll({ page, order, deleted = true }) {
        let message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const offset = (await !page) || +page < 1 ? 0 : +page - 1;
            const limit = await process.env.QUERY_LIMIT;
            const queries = await {
                raw: true,
                nest: true,
                include: [
                    {
                        model: db.Categories,
                        as: 'category',
                        raw: true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.Branchs,
                        as: 'branch',
                        raw: true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                ],
            };

            if (order.length > 0) {
                queries.order = await [order];
            }
            if (!deleted) {
                (queries.where = await {
                    destroyTime: {
                        [op.not]: null,
                    },
                }),
                    (queries.paranoid = deleted);
            }
            queries.offset = (await offset) * limit;
            queries.limit = await +limit;
            const { count, rows } = await db.Dishs.findAndCountAll({
                ...queries,
            });
            const countDeleted = await db.Dishs.findAndCountAll({
                where: {
                    destroyTime: {
                        [op.not]: null,
                    },
                },
                paranoid: false,
                raw: true,
            });
            const countPage = count / limit;
            if (rows) {
                return (message = {
                    err: 0,
                    mes: 'Hành động thành công!',
                    type: 'success',
                    dishs: rows,

                    countPage,
                    countDeleted: countDeleted.count,
                });
            }
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async destroy(id) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const deletedCustomers = await db.Dishs.destroy({
                where: {
                    id,
                },
                raw: true,
                nest: true,
            });
            message.errr = await 0;
            message.mes = await 'Xóa thành công!';
            message.type = await 'success';
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }

    async restore(id) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            console.log(id);
            const restore = await db.Dishs.restore({
                where: {
                    id,
                },
                raw: true,
                nest: true,
            });
            if (!restore) {
                return message;
            }
            message.errr = await 0;
            message.mes = await 'Khôi phục thành công!';
            message.type = await 'success';
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async force(id) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const delelted = await false;
            const dish = await this.findOne(id, delelted);
            const forceImg = await db.Images.destroy({ where: { id_dish: id }, force: true, raw: true, nest: true });
            const force = await db.Dishs.destroy({
                where: {
                    id,
                },
                force: true,
                raw: true,
                nest: true,
            });
            if (!force || !forceImg || !dish) {
                return message;
            }
            const removeAvatar = await removeAvatarInFolder(dish.avatar, process.env.PATH_DISH);
            const removeArrImg = await removeArrImgInFolder(dish.image, process.env.PATH_DISH);

            message.errr = await 0;
            message.mes = await 'Xóa thành công!';
            message.type = await 'success';
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async destroyMutiple(arrId) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const deleted = await db.Dishs.destroy({
                where: {
                    id: arrId,
                },
                raw: true,
                nest: true,
            });
            if (!deleted) {
                return message;
            }
            message.errr = await 0;
            message.mes = await 'Xóa thành công!';
            message.type = await 'success';
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async forceDestroy(arrId, deleted = true) {
        try {
            const queries = await {
                where: {
                    id: arrId,
                },
                force: true,
                raw: true,
                nest: true,
            };

            const dishs = await db.Dishs.destroy({
                ...queries,
            });

            return dishs;
        } catch (error) {
            return false;
        }
    }
    async forceImageForDish(arrId) {
        try {
            const queries = await {
                where: {
                    id: arrId,
                },
                force: true,
                raw: true,
                nest: true,
            };

            const dishs = await db.Images.destroy({
                ...queries,
            });

            return dishs;
        } catch (error) {
            return false;
        }
    }
    async forceMutiple(arrId) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const deleted = await false;
            const dishArr = await this.findAll(arrId, deleted);
            const images = dishArr.reduce((acc, cur) => {
                return [...acc, ...cur.image];
            }, []);

            const forcedDishs = await this.forceDestroy(arrId);
            const forcedImages = await this.forceImageForDish(arrId);
            await removeArrImgInFolder(images, process.env.PATH_DISH);

            if (!forcedDishs && !forcedImages) {
                return message;
            }
            message.errr = await 0;
            message.mes = await 'Xóa thành công!';
            message.type = await 'success';
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async restoreMutiple(arrId) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const restored = await db.Dishs.restore({
                where: {
                    id: arrId,
                },
                raw: true,
                nest: true,
            });
            if (!restored) {
                return message;
            }
            message.err = await 0;
            message.mes = await 'Khôi phục thành công!';
            message.type = await 'success';
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
}

module.exports = new CartService();
