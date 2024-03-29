'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Category.hasMany(models.Dishs, { foreignKey: 'id_category', as: 'categories' });
        }
    }
    Category.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Categories',
        },
    );
    Category.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return Category;
};
