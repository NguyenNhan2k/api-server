const fs = require('fs-extra');
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
            console.log(stores);
            if (!stores) {
                return message;
            }
            return (message = {
                err: 0,
                mes: 'Hành động thành công!',
                type: 'success',
                stores,
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
            const { districts: district, wards: ward, name, ...other } = await payload;
            const [user, created] = await db.Branchs.findOrCreate({
                where: { name },
                defaults: {
                    district,
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
            const branch = await db.Branchs.findOne({
                where: { id },
                raw: true,
                nest: true,
            });
            const stores = await db.Stores.findAll({
                raw: true,
                nest: true,
            });
            if (branch) {
                return (message = {
                    err: 0,
                    mes: 'Hành động thành công!',
                    type: 'success',
                    branch,
                    stores,
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
                include: {
                    model: db.Stores,
                    as: 'store',
                    raw: true,
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
            const { count, rows } = await db.Branchs.findAndCountAll({
                ...queries,
            });
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
            if (rows) {
                return (message = {
                    err: 0,
                    mes: 'Hành động thành công!',
                    type: 'success',
                    branchs: rows,
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
            console.log(branch);
            if (avatar) {
                const getAvatar = await db.Branchs.findByPk(id, {
                    raw: true,
                });
                const pathUrlImg = await `${avatar.destination}/${getAvatar.avatar}`;
                await fs.remove(pathUrlImg);
            }
            const branchUpdate = await db.Branchs.update(branch, { where: { id }, returning: true, raw: true });
            console.log(branchUpdate);
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
