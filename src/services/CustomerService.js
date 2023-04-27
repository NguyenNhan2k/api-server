const fs = require('fs-extra');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const db = require('../models');
const { hashPassword } = require('../helpers/hashPwd');
const { object } = require('joi');
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
                const pathUrlImg = await `${file.destination}/${getImgUser.dataValues.url_img}`;
                await fs.remove(pathUrlImg);
            }
            const userUpdate = await db.Customers.update(user, { where: { id }, returning: true });
            console.log(userUpdate);
            return (message = {
                err: 0,
                type: 'success',
                message: 'Update user successfully!',
            });
        } catch (error) {
            console.log(error);
            return (message = {
                err: 1,
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
                return (message = {
                    err: 0,
                    mes: 'Hành động thành công!',
                    type: 'success',
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
