'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Dish extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Dish.belongsTo(models.Branchs, { foreignKey: 'id_branch', as: 'branch' });
            Dish.belongsTo(models.Categories, { foreignKey: 'id_category', as: 'category' });
            Dish.hasMany(models.Images, { foreignKey: 'id_dish', as: 'image' });
        }
    }
    Dish.init(
        {
            name: DataTypes.STRING,
            id_branch: DataTypes.STRING,
            id_category: DataTypes.STRING,
            price: DataTypes.INTEGER,
            avatar: DataTypes.STRING,
            sale: DataTypes.INTEGER,
            description: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Dishs',
        },
    );
    Dish.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return Dish;
};
