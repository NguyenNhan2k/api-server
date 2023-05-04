const fs = require('fs-extra');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const db = require('../models');

const { removeArrImgInFolderNew, removeAvatarInFolder } = require('../helpers/manage');
class StoreService {
    async create(payload, file) {
        var message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const { email, phone, name } = await payload;
            const [user, created] = await db.Stores.findOrCreate({
                where: { email, phone, name },
                defaults: {
                    name,
                    email,
                    phone,
                    ...(file ? { avatar: file.filename } : {}),
                },
                raw: true,
                nest: true,
            });
            if (!created) {
                message.mes = await 'Store is already created!';
                return message;
            }
            message.err = await 0;
            message.mes = await 'Create store successfully';
            message.type = await 'success';
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async findOne(id, deleted = true) {
        let message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const queries = await {
                where: { id },
                raw: false,
                nest: true,
                include: [
                    {
                        model: db.Branchs,
                        as: 'branchs',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                        include: {
                            model: db.Rates,
                            as: 'rates',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                            include: [
                                {
                                    model: db.RateImgs,
                                    as: 'images',
                                    attributes: {
                                        exclude: ['createdAt', 'updatedAt'],
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
                        },
                    },
                ],
            };
            if (!deleted) {
                (queries.where = await {
                    destroyTime: {
                        [op.not]: null,
                    },
                }),
                    (queries.paranoid = deleted);
            }
            const store = await db.Stores.findOne({ ...queries });
            return store.toJSON();
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

            const store = await this.findOne(id);
            const idRate = await store.branchs
                .filter((branch) => {
                    if (branch.rates.length > 0) {
                        return branch;
                    }
                })
                .map((branch) => {
                    return branch.rates.map((rate) => {
                        return rate.images;
                    });
                });

            const countImg = idRate.flat(Infinity).length;
            if (!store) {
                return message;
            }
            return (message = {
                err: 0,
                mes: 'Hành động thành công!',
                type: 'success',
                store,
                countImg,
            });
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
            const { count, rows } = await db.Stores.findAndCountAll({
                ...queries,
            });
            const countDeleted = await db.Stores.findAndCountAll({
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
                    stores: rows,
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
            const deletedCustomers = await db.Stores.destroy({
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
    async update({ id, ...payload }, file) {
        let message = {
            err: 1,
            type: 'warning',
            mes: 'Update store fail !',
        };
        try {
            const store = await db.Stores.findOne({ where: { id }, raw: true });
            const storeUpdate = await db.Stores.update(
                {
                    ...payload,
                    ...(file ? { avatar: file.filename } : {}),
                },
                { where: { id }, returning: true },
            );

            if (!storeUpdate || !store) {
                return message;
            }
            await removeAvatarInFolder(store.avatar, process.env.PATH_STORE);
            return (message = {
                err: 0,
                type: 'success',
                mes: 'Update store successfully!',
            });
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
            const deletedCustomers = await db.Stores.restore({
                where: {
                    id,
                },
                raw: true,
                nest: true,
            });
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
            const store = await db.Stores.findOne({ where: { id }, raw: true, paranoid: false });
            const deleted = await db.Stores.destroy({
                where: {
                    id,
                },
                force: true,
                raw: true,
                nest: true,
            });
            if (!store && !deleted) {
                return message;
            }
            await removeAvatarInFolder(store.avatar, process.env.PATH_STORE);
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
            const deleted = await db.Stores.destroy({
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
    async forceMutiple(arrId) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const stores = await db.Stores.findAll({ where: { id: arrId }, raw: true, paranoid: false });
            const deleted = await db.Stores.destroy({
                where: {
                    id: arrId,
                },
                force: true,
                raw: true,
                nest: true,
            });
            if (!stores && !deleted) {
                return message;
            }
            const storeImgs = await stores.map((img) => {
                return img.avatar;
            });
            await removeArrImgInFolderNew(storeImgs, process.env.PATH_STORE);
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
            const restored = await db.Stores.restore({
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

module.exports = new StoreService();
