const fs = require('fs-extra');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

const db = require('../models');
const { removeArrImgInFolder, removeAvatarInFolder } = require('../helpers/manage');
class DishService {
    async create(payload, files) {
        var message = {
            err: 1,
            mes: 'Hành động thất bại!',
            type: 'warning',
        };
        try {
            const { name, ...other } = await payload;
            const avatar = (await files) && files.avatar ? files.avatar[0].filename : {};
            console.log(avatar);
            const [dish, created] = await db.Dishs.findOrCreate({
                where: { name },
                defaults: {
                    name,
                    ...other,
                    avatar,
                },
                raw: true,
            });

            if (!created) {
                const pathAvatar = (await files.avatar) ? files.avatar[0].path : {};
                await fs.remove(pathAvatar);
                if (files && files.images) {
                    files.images.forEach((img) => {
                        const pathIg = img.path;
                        fs.remove(pathIg);
                    });
                }
                // const pathUrlImg = await `${file.destination}/${getImgUser.dataValues.url_img}`;
                // await fs.remove(pathUrlImg);
                message.mes = await 'Food is already created!';
                return message;
            }

            const { dataValues: valueDish } = await dish;
            if (files) {
                const { images } = await files;
                const getNameImgs = await images.map((img) => {
                    return {
                        image: img.filename,
                        id_dish: valueDish.id,
                    };
                });
                await db.Images.bulkCreate(getNameImgs, {
                    returning: true,
                    validate: true,
                    individualHooks: true,
                });
            }

            message.err = await 0;
            message.mes = await 'Create Food successfully';
            message.type = await 'success';
            return message;
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
    async update(id, payload, files) {
        let imagesNew = [];
        let imagesOld = [];
        let message = {
            err: 1,
            type: 'warning',
            mes: 'Update store fail !',
        };
        try {
            const dish = await db.Dishs.findOne({
                where: { id },
                include: {
                    model: db.Images,
                    as: 'image',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            });
            if (files && files.avatar) {
                const pathAvatar = (await files.avatar) ? `${files.avatar[0].destination}/${dish.id}` : {};
                await fs.remove(pathAvatar);
            }
            if (files && files.images) {
                // Xóa hình ảnh trong thực đơn ở folder Dish
                dish.image.forEach((img) => {
                    const pathIg = `${process.env.PATH_DISH}/${img.image}`;
                    fs.remove(pathIg);
                    imagesOld.push(img.id);
                });

                // Array hình ảnh mới được update
                imagesNew = files.images.map((img) => {
                    return {
                        id_dish: dish.id,
                        image: img.filename,
                    };
                });
            }
            const userUpdate = await db.Dishs.update(
                {
                    ...payload,
                    ...(files.avatar ? { avatar: files.avatar[0].filename } : {}),
                },
                { where: { id }, returning: true },
            );

            await db.Images.destroy({ where: { id: imagesOld }, force: true });
            await db.Images.bulkCreate(imagesNew, {
                returning: true,
                validate: true,
                individualHooks: true,
            });
            if (!userUpdate) {
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

module.exports = new DishService();
