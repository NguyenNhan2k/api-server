const fs = require('fs-extra');
var slug = require('slug');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const db = require('../models');
const { hashPassword } = require('../helpers/hashPwd');
const { object } = require('joi');
class BranchService {
    async indexCreate() {
        var message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const stores = await db.Stores.findAll({
                raw: true,
            });
            const category = await db.StoreCategories.findAll({
                raw: true,
            });
            if (!stores) {
                return message;
            }
            return (message = {
                err: 0,
                mes: 'Hành động thành công!',
                type: 'success',
                stores,
                category,
            });
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async create(payload, avatar) {
        var message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            let { wards: ward, name, ...other } = await payload;
            other.slug = slug(name);
            console.log(other.slug);
            const [user, created] = await db.Branchs.findOrCreate({
                where: { name },
                defaults: {
                    district: 'Thành phố Cần Thơ',
                    ward,
                    avatar: avatar ? avatar.filename : '',
                    id_store: other.store,
                    ...other,
                },
                raw: true,
                nest: true,
            });
            if (!created) {
                message.mes = await 'Branch is already created!';
                return message;
            }
            message.err = await 0;
            message.mes = await 'Create Branch successfully';
            message.type = await 'success';
            return message;
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
                        model: db.Stores,
                        as: 'store',
                        raw: true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.Dishs,
                        as: 'dishs',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                        include: {
                            model: db.Categories,
                            as: 'category',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                    },
                    {
                        model: db.Rates,
                        as: 'rates',

                        include: {
                            model: db.Customers,
                            as: 'customer',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                    },
                    {
                        model: db.StoreCategories,
                        as: 'category',
                        raw: true,
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
            const dish = await db.Branchs.findOne({
                ...queries,
            });
            return dish.toJSON();
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async findOneBySlug(slug, deleted = true) {
        try {
            const queries = await {
                where: { slug },
                include: [
                    {
                        model: db.Stores,
                        as: 'store',
                        raw: true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.Dishs,
                        as: 'dishs',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                        include: {
                            model: db.Categories,
                            as: 'category',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                    },
                    {
                        model: db.Rates,
                        as: 'rates',

                        include: {
                            model: db.Customers,
                            as: 'customer',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                    },
                    {
                        model: db.StoreCategories,
                        as: 'category',
                        raw: true,
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
            const dish = await db.Branchs.findOne({
                ...queries,
            });
            return dish.toJSON();
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async findAll({ page, order, deleted = true }) {
        try {
            const offset = (await !page) || +page < 1 ? 0 : +page - 1;
            const limit = await process.env.QUERY_LIMIT;
            const queries = await {
                include: [
                    {
                        model: db.Stores,
                        as: 'store',
                        raw: true,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                    {
                        model: db.Dishs,
                        as: 'dishs',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                        include: {
                            model: db.Categories,
                            as: 'category',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                    },
                    {
                        model: db.Rates,
                        as: 'rates',
                        include: {
                            model: db.Customers,
                            as: 'customer',
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                        },
                    },
                    {
                        model: db.StoreCategories,
                        as: 'category',
                        raw: true,
                    },
                ],
                raw: false,
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
            const { count, rows } = await db.Branchs.findAndCountAll({
                ...queries,
            });
            const convertRows = await rows.map((item) => {
                return item.toJSON();
            });
            return { count, convertRows };
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
            const branch = await this.findOne(id);
            const stores = await db.Stores.findAll({
                raw: true,
                nest: true,
            });
            if (branch) {
                const price = await db.Dishs.findAll({
                    where: { id_branch: id },
                    attributes: [
                        [Sequelize.fn('max', Sequelize.col('price')), 'maxPrice'],
                        [Sequelize.fn('min', Sequelize.col('price')), 'minPrice'],
                    ],
                    raw: true,
                });
                let categories = [];
                await branch.dishs.forEach((item) => {
                    if (!categories.includes(item.category.name)) {
                        categories.push(item.category.name);
                    }
                });

                return (message = {
                    err: 0,
                    mes: 'Hành động thành công!',
                    type: 'success',
                    branch,
                    stores,
                    price,
                    categories,
                });
            }
            return message;
        } catch (error) {
            console.log(error);
            return message;
        }
    }
    async getOneBySlug(slug) {
        let message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            if (!slug) {
                return message;
            }
            const branch = await this.findOneBySlug(slug);
            const stores = await db.Stores.findAll({
                raw: true,
                nest: true,
            });
            if (branch) {
                const price = await db.Dishs.findAll({
                    where: { id_branch: branch.id },
                    attributes: [
                        [Sequelize.fn('max', Sequelize.col('price')), 'maxPrice'],
                        [Sequelize.fn('min', Sequelize.col('price')), 'minPrice'],
                    ],
                    raw: true,
                });
                let categories = [];
                await branch.dishs.forEach((item) => {
                    if (!categories.includes(item.category.name)) {
                        categories.push(item.category.name);
                    }
                });

                return (message = {
                    err: 0,
                    mes: 'Hành động thành công!',
                    type: 'success',
                    branch,
                    stores,
                    price,
                    categories,
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
            const limit = await process.env.QUERY_LIMIT;
            const { count, convertRows } = await this.findAll({ page, order, deleted });
            const countDeleted = await db.Branchs.findAndCountAll({
                where: {
                    destroyTime: {
                        [op.not]: null,
                    },
                },
                paranoid: false,
                raw: true,
            });
            const countPage = count / limit;
            if (convertRows) {
                return (message = {
                    err: 0,
                    mes: 'Hành động thành công!',
                    type: 'success',
                    branchs: convertRows,
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
            const deleted = await db.Branchs.destroy({
                where: {
                    id,
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
    async update({ id, districts: district, wards: ward, ...payload }, avatar) {
        let message = {
            err: 1,
            type: 'warning',
            mes: 'Update branch fail !',
        };
        try {
            const branch = await {
                district,
                ward,
                ...payload,
                ...(avatar ? { avatar: avatar.filename } : {}),
            };
            if (avatar) {
                const getAvatar = await db.Branchs.findByPk(id, {
                    raw: true,
                });
                const pathUrlImg = await `${avatar.destination}/${getAvatar.avatar}`;
                await fs.remove(pathUrlImg);
            }
            const branchUpdate = await db.Branchs.update(branch, { where: { id }, returning: true, raw: true });
            if (!branchUpdate) {
                return message;
            }
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
            const restore = await db.Branchs.restore({
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
            const deleted = await db.Branchs.destroy({
                where: {
                    id,
                },
                force: true,
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
    async destroyMutiple(arrId) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const deleted = await db.Branchs.destroy({
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
    async forceMutiple(arrId) {
        const message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const destroy = await db.Branchs.destroy({
                where: {
                    id: arrId,
                },
                force: true,
                raw: true,
                nest: true,
            });
            if (!destroy) {
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
            const restored = await db.Branchs.restore({
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

module.exports = new BranchService();
