'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Rate extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Rate.belongsTo(models.Branchs, { foreignKey: 'id_branch', targetKey: 'id', as: 'branch' });
            Rate.hasMany(models.RateImgs, { foreignKey: 'id_rate', as: 'images' });
            Rate.belongsTo(models.Customers, { foreignKey: 'id_customer', as: 'customer' });
        }
    }
    Rate.init(
        {
            title: DataTypes.STRING,
            content: DataTypes.STRING,
            location: DataTypes.NUMBER,
            price: DataTypes.NUMBER,
            quality: DataTypes.NUMBER,
            servi: DataTypes.NUMBER,
            space: DataTypes.NUMBER,
            id_branch: DataTypes.STRING,
            id_customer: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Rates',
        },
    );
    Rate.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return Rate;
};
