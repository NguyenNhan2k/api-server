'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class StoreCategory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            StoreCategory.hasMany(models.Branchs, { foreignKey: 'id_category', as: 'branchs' });
        }
    }
    StoreCategory.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'StoreCategories',
        },
    );
    StoreCategory.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return StoreCategory;
};
