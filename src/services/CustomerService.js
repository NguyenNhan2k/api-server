const db = require('../models');

const fs = require('fs-extra');
const { where } = require('sequelize');

class CustomerService {
    async update({ id, ...body }, file) {
        let message;
        try {
            const user = await {
                ...body,
                ...(file ? { url_img: file.filename } : {}),
            };
            if (file) {
                const getImgUser = await db.Users.findByPk(id);
                const pathUrlImg = await `${file.destination}/${getImgUser.dataValues.url_img}`;
                await fs.remove(pathUrlImg);
            }

            const userUpdate = await db.Users.update(user, { where: { id }, returning: true });

            return (message = {
                err: 0,
                type: 'success',
                message: 'Update user successfully!',
            });
        } catch (error) {
            return (message = {
                err: 1,
                type: 'warning',
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
            const userUpdate = await db.Users.update({ refresh_token: '' }, { where: { id }, returning: true });
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
            const findCustomer = await db.Users.findOne({
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
    async getAll(id) {
        let message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const customers = await db.Users.findAll({
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
            if (customers) {
                return (message = {
                    err: 0,
                    mes: 'Hành động thành công!',
                    type: 'success',
                    customers: customers,
                });
            }
            return message;
        } catch (error) {
            return message;
        }
    }
}

module.exports = new CustomerService();
