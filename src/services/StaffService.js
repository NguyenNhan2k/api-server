const fs = require('fs-extra');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const db = require('../models');
const { hashPassword } = require('../helpers/hashPwd');
const { object } = require('joi');
class StaffService {
    async create(payload) {
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
            const { email, password, phone, fullName, address, url_img } = await payload;
            const [user, created] = await db.Staffs.findOrCreate({
                where: { email },
                defaults: {
                    fullName,
                    email,
                    phone,
                    address,
                    url_img,
                    password: hashPassword(password),
                },
                ...option,
            });
            if (!created) {
                message.mes = await 'Staff is already registered!';
                return message;
            }
            message.err = await 0;
            message.mes = await 'Create Staff successfully';
            message.type = await 'success';
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
            const staff = await db.Staffs.findOne({
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
            if (staff) {
                return (message = {
                    err: 0,
                    mes: 'Hành động thành công!',
                    type: 'success',
                    staff: staff,
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
            const { count, rows } = await db.Staffs.findAndCountAll({
                ...queries,
            });
            const countDeleted = await db.Staffs.findAndCountAll({
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
                    staffs: rows,
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
            const deletedCustomers = await db.Staffs.destroy({
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
    async update({ id, ...body }, file) {
        let message;
        try {
            const user = await {
                ...body,
                ...(file ? { url_img: file.filename } : {}),
            };
            console.log(user);
            if (file) {
                const getImgUser = await db.Staffs.findByPk(id);
                const pathUrlImg = await `${file.destination}/${getImgUser.dataValues.url_img}`;
                await fs.remove(pathUrlImg);
            }
            const userUpdate = await db.Staffs.update(user, { where: { id }, returning: true });
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
                mes: 'Update staff fail !',
            });
        }
    }
}

module.exports = new StaffService();
