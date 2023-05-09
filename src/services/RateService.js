const fs = require('fs-extra');
const Sequelize = require('sequelize');
const op = Sequelize.Op;
const db = require('../models');
const { removeArrImgInFolder, removeAvatarInFolder, removeArrImgForController } = require('../helpers/manage');
class RateService {
    // async findOne(id,queries) {
    //     let message = {
    //         err: 1,
    //         mes: 'Hành động thất bại!',
    //         type: 'warning',
    //     };
    //     try {
    //         const
    //     } catch (error) {
    //         console.log(error)
    //         return message
    //     }
    // }
    async create(payload, files, id) {
        var message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const { id_customer, id_branch, ...other } = await payload;
            const branch = await db.Branchs.findOne({ where: { id: id_branch }, raw: true });
            if (!branch) {
                return message;
            }
            const [rate, created] = await db.Rates.findOrCreate({
                raw: true,
                where: { id_customer: id },
                defaults: {
                    ...payload,
                },
            });
            if (!created) {
                if (files) {
                    await removeArrImgForController(files);
                }
                message.mes = 'Bạn không thể bình luận thêm!';
                return message;
            }

            if (files) {
                const rateImgs = await files.map((file) => {
                    const images = {
                        image: file.filename,
                        id_rate: rate.id,
                    };
                    return images;
                });
                await db.RateImgs.bulkCreate(rateImgs, {
                    returning: true,
                    validate: true,
                    individualHooks: true,
                });
            }
            return (message = {
                err: 0,
                mes: 'Bình luận thành công',
                type: 'success',
                branch,
            });
        } catch (error) {
            const pathAvatar = (await files.avatar) ? files.avatar[0].path : {};
            await fs.remove(pathAvatar);
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
    async update(id, payload, user = '', files) {
        let message = {
            err: 1,
            type: 'warning',
            mes: 'Update comment fail !',
            displayModal: 'none',
        };
        try {
            //1. Kiểm tra role người dùng

            const rate = await db.Rates.findOne({
                where: { id },
                raw: false,
                nest: true,
                include: [
                    {
                        model: db.RateImgs,
                        as: 'images',
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
            }).then((result) => {
                return result.toJSON();
            });
            message.branch = await rate.branch;
            if (user.id_role === 'R3') {
                const isCustomer = await db.Customers.findOne({ where: { id: user.id }, raw: true });
                if (!isCustomer) {
                    message.mes = 'Vui Lòng đăng nhập để tiếp tục!';
                    return message;
                }
                if (isCustomer.id !== rate.id_customer) {
                    message.mes = await 'Bạn không được phép chỉnh sửa!';
                    return message;
                }
            }
            if (!rate) {
                message.mes = 'Hành động thất bại!';
                return message;
            }

            //2. Update thông tin đã khách hàng submit
            const updateRate = await db.Rates.update(payload, { where: { id }, raw: true });
            if (!updateRate) {
                return message;
            }
            //3. Xử lý ảnh của comment
            if (files && files.length > 0) {
                const getNameImgs = await files.map((img) => {
                    return {
                        image: img.filename,
                        id_rate: id,
                    };
                });
                console.log('o day', files);
                //3.1 Xóa ảnh của commment trong db
                const forceImgs = await db.RateImgs.destroy({
                    where: { id_rate: id },
                    force: true,
                });
                //3.2 Tạo ảnh của commment trong db
                await db.RateImgs.bulkCreate(getNameImgs, {
                    returning: true,
                    validate: true,
                    individualHooks: true,
                });
                // 3.3 Xóa ảnh trong folder
                if (rate.images && rate.images.length > 0) {
                    await removeArrImgInFolder(rate.images, process.env.PATH_RATE_IMG);
                }
            }
            return (message = {
                err: 0,
                type: 'success',
                mes: 'Update comment successfully !',
                branch: rate.branch,
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
    async force(idRate, user) {
        let message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            //1. Kiểm tra quyền khách hàng.
            const rate = await db.Rates.findOne({
                where: { id: idRate },
                raw: false,
                nest: true,
                include: [
                    {
                        model: db.RateImgs,
                        as: 'images',
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
            }).then((result) => {
                return result.toJSON();
            });
            message.branch = await rate.branch;
            if (!rate) {
                return message;
            }
            console.log('O day 1');
            if (user.id_role === 'R3') {
                const isCustomer = await db.Customers.findOne({ where: { id: user.id }, raw: true });
                if (!isCustomer) {
                    console.log('O day khong co user');
                    message.mes = 'Vui Lòng đăng nhập để tiếp tục!';
                    return message;
                }
                if (isCustomer.id !== rate.id_customer) {
                    console.log('O day khong duoc phep');
                    message.mes = await 'Bạn không được phép xóa!';
                    return message;
                }
            }
            //2. Xóa hình ảnh comment trong db.

            if (rate.images && rate.images.length > 0) {
                const arrIdImgs = await rate.images.map((img) => {
                    return img.id;
                });
                const forceImgs = await db.RateImgs.destroy({ where: { id: arrIdImgs }, raw: true, force: true });
                if (!forceImgs) {
                    console.log('O day xoa', forceImgs);
                    return message;
                }
            }

            //3. Xóa hình ảnh trong folder

            //4. Xoa comment
            const forceComment = await db.Rates.destroy({ where: { id: idRate }, force: true });
            if (!forceComment) {
                return message;
            }
            await removeArrImgInFolder(rate.images, process.env.PATH_RATE_IMG);
            return (message = {
                err: 0,
                type: 'success',
                mes: 'Deleted comment successfully !',
                branch: rate.branch,
            });
        } catch (error) {
            console.log(error);
            return message;
        }
    }
}

module.exports = new RateService();
