const fs = require('fs-extra');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const db = require('../models');
const { hashPassword } = require('../helpers/hashPwd');
var paypal = require('paypal-rest-sdk');
const { indexHistory } = require('../controllers/CustomerController');
class CustomerService {
    async update({ id, ...body }, file) {
        let message;
        try {
            const user = await {
                ...body,
                ...(file ? { url_img: file.filename } : {}),
            };
            if (file) {
                const getImgUser = await db.Customers.findByPk(id);
                if (getImgUser.dataValues.url_img != 'user.png') {
                    const pathUrlImg = await `${file.destination}/${getImgUser.dataValues.url_img}`;
                    await fs.remove(pathUrlImg);
                }
            }
            const userUpdate = await db.Customers.update(user, { where: { id }, raw: true });
            console.log(user);

            return (message = {
                err: 0,
                type: 'success',
                mes: 'Update user successfully!',
            });
        } catch (error) {
            console.log(error);
            return (message = {
                err: 1,
                type: 'warning',
            });
        }
    }
    async indexHistory(user) {
        let message = {
            err: 1,
            type: 'warning',
            mes: 'Create order failed!',
        };
        try {
            const { id } = await user;
            const customer = await db.Customers.findOne({ where: { id } }).then((result) =>
                result ? result.toJSON() : null,
            );
            if (!customer) {
                return message;
            }
            const cart = await db.Carts.findOne({
                nest: true,
                where: { id_customer: id },
                include: {
                    model: db.CartDetails,
                    as: 'detailCart',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            });
            const orders = await db.Orders.findAll({
                where: { id_customer: customer.id },
                include: {
                    model: db.OrderDetails,
                    raw: true,
                    as: 'orderDetrails',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                    include: {
                        model: db.Dishs,
                        raw: true,
                        as: 'dish',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                },
                raw: false,
                nest: true,
            });
            const convertOrder = (await orders) && orders.map((order) => order.toJSON());
            const convertCart = (await cart) ? cart.toJSON() : null;
            return (message = {
                err: 0,
                type: 'success',
                mes: 'Update user successfully!',
                customer,
                ...(convertOrder ? { order: convertOrder } : { order: {} }),
                ...(convertCart ? { cart: convertCart.detailCart } : { cart: {} }),
            });
        } catch (error) {
            console.log(error);
            return (message = {
                err: 1,
                type: 'warning',
            });
        }
    }
    async createOrderForCustomer(idCart, user, payload) {
        let message = {
            err: 1,
            type: 'warning',
            mes: 'Create order failed!',
        };
        try {
            const { id } = await user;
            const customer = await db.Customers.findOne({ where: { id }, raw: true });
            const cart = await db.Carts.findOne({
                nest: true,
                where: { id_customer: id },
                include: [
                    {
                        model: db.CartDetails,
                        as: 'detailCart',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                        include: {
                            model: db.Dishs,
                            as: 'dish',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                    },
                    {
                        model: db.Customers,
                        as: 'customer',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                ],
            });
            const convertCart = (await cart) ? cart.toJSON() : null;
            if (!convertCart) {
                return message;
            }
            //Tao order
            const createOrder = await db.Orders.create({
                id_customer: id,
                ...payload,
            }).then((result) => (result ? result.toJSON() : null));
            if (!createOrder) {
                return message;
            }
            let totalOrder = await 0;
            let orderDetail = await convertCart.detailCart.map((item) => {
                totalOrder += item.total;
                return {
                    id_dish: item.id_dish,
                    id_order: createOrder.id,
                    total: item.total,
                    quanlity: item.quanlity,
                    price: item.dish.price,
                };
            });
            const updateOrder = await db.Orders.update({ total: totalOrder }, { where: { id: createOrder.id } });
            const createOrderDetail = await db.OrderDetails.bulkCreate(orderDetail, {
                returning: true,
                validate: true,
                individualHooks: true,
            });
            if (createOrderDetail) {
                const removeCart = await db.Carts.destroy({ where: { id: idCart }, force: true });
                const removeCartDetail = await db.CartDetails.destroy({ where: { id_cart: idCart }, force: true });
            }

            return (message = {
                err: 0,
                type: 'success',
                mes: 'Đặt hàng thành công!',
                cart: convertCart.detailCart,
            });
        } catch (error) {
            console.log(error);
            return (message = {
                err: 1,
                type: 'warning',
            });
        }
    }

    async changePwd(id, { password }) {
        let message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const user = await db.Customers.update({ password: hashPassword(password) }, { where: { id }, raw: true });
            if (!user) {
                return message;
            }
            return (message = {
                err: 0,
                type: 'success',
                mes: 'Update password successfully!',
            });
        } catch (error) {
            console.log(error);
            return (message = {
                err: 1,
                mes: 'Update password fail !',
                type: 'warning',
            });
        }
    }
    async updateByStaff({ id, ...body }, file) {
        let message;
        try {
            const user = await {
                ...body,
                ...(file ? { url_img: file.filename } : {}),
            };
            if (file) {
                const getImgUser = await db.Customers.findByPk(id);
                const pathUrlImg = await `${file.destination}/${getImgUser.dataValues.url_img}`;
                await fs.remove(pathUrlImg);
            }
            const userUpdate = await db.Customers.update(user, { where: { id }, returning: true });
            return (message = {
                err: 0,
                type: 'success',
                mes: 'Update user successfully!',
            });
        } catch (error) {
            console.log(error);
            return (message = {
                err: 1,
                type: 'warning',
                mes: 'Update user fail!',
            });
        }
    }
    async indexCart(user) {
        let message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const { id } = await user;
            const customer = await db.Customers.findOne({ where: { id }, raw: true });
            const cart = await db.Carts.findOne({
                nest: true,
                where: { id_customer: id },
                include: [
                    {
                        model: db.CartDetails,
                        as: 'detailCart',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                        include: {
                            model: db.Dishs,
                            as: 'dish',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                    },
                    {
                        model: db.Customers,
                        as: 'customer',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                ],
            });
            let newCart = (await cart) ? cart.toJSON() : null;
            return (message = {
                err: 0,
                mes: 'Hành động thành công!',
                type: 'success',
                customer,
                cart: newCart,
            });
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async logout(id) {
        let message = {
            err: 1,
            mes: 'Đăng xuất thất bại!',
            type: 'warning',
        };
        try {
            const userUpdate = await db.Customers.update({ refresh_token: '' }, { where: { id }, returning: true });
            if (userUpdate) {
                return (message = {
                    err: 0,
                    mes: 'Đăng xuất thành công!',
                    type: 'success',
                });
            }
            return message;
        } catch (error) {
            console.log(error);
            return message;
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
            const findCustomer = await db.Customers.findOne({
                where: { id },
                attributes: {
                    exclude: ['password', 'refresh_token', 'createdAt', 'updatedAt', 'id_role'],
                },
                include: {
                    model: db.Role,
                    as: 'role',
                    raw: true,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
                raw: true,
                nest: true,
            });
            if (findCustomer) {
                const cart = await db.Carts.findOne({
                    nest: true,
                    where: { id_customer: id },
                    include: [
                        {
                            model: db.CartDetails,
                            as: 'detailCart',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                            include: {
                                model: db.Dishs,
                                as: 'dish',
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt'],
                                },
                            },
                        },
                        {
                            model: db.Customers,
                            as: 'customer',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                    ],
                });
                let newCart = (await cart) ? cart.toJSON() : null;
                return (message = {
                    err: 0,
                    mes: 'Hành động thành công!',
                    type: 'success',
                    cart: newCart,
                    customer: findCustomer,
                });
            }
            return message;
        } catch (error) {
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
                attributes: {
                    exclude: ['password', 'refresh_token', 'createdAt', 'updatedAt', 'id_role'],
                },
                include: {
                    model: db.Role,
                    as: 'role',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
                raw: true,
                nest: true,
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
            const { count, rows } = await db.Customers.findAndCountAll({
                ...queries,
            });
            const countDeleted = await db.Customers.findAndCountAll({
                where: {
                    destroyTime: {
                        [op.not]: null,
                    },
                },
                attributes: {
                    exclude: ['password', 'refresh_token', 'createdAt', 'updatedAt', 'id_role'],
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
                    customers: rows,
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
    async create(payload, img) {
        const option = {
            raw: true,
            nest: true,
            attributes: {
                exclude: ['password', 'refresh_token', 'createdAt', 'updatedAt', 'id_role'],
            },
        };
        var message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const { email, password, phone, fullName, address } = await payload;
            const [user, created] = await db.Customers.findOrCreate({
                where: { email },
                defaults: {
                    fullName,
                    email,
                    phone,
                    address,
                    ...(img ? { url_img: img.filename } : {}),
                    password: hashPassword(password),
                },
                ...option,
            });
            if (!created) {
                message.mes = await 'Customers is already registered!';
                return message;
            }
            return (message = {
                err: 0,
                mes: 'Create customers successfully',
                type: 'success',
            });
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
            const deletedCustomers = await db.Customers.destroy({
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
    async force(id) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const deletedCustomers = await db.Customers.destroy({
                where: {
                    id,
                },
                force: true,
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
            const deletedCustomers = await db.Customers.restore({
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
    async destroyMutiple(arrId) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const deletedCustomers = await db.Customers.destroy({
                where: {
                    id: arrId,
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
    async restoreMutiple(arrId) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const restoreCustomers = await db.Customers.restore({
                where: {
                    id: arrId,
                },
                raw: true,
                nest: true,
            });
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

module.exports = new CustomerService();
