'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class CartDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            CartDetail.belongsTo(models.Dishs, { foreignKey: 'id_dish', as: 'dish' });
            CartDetail.belongsTo(models.Carts, { foreignKey: 'id_cart', as: 'cart' });
        }
    }
    CartDetail.init(
        {
            id_cart: DataTypes.STRING,
            id_dish: DataTypes.STRING,
            total: DataTypes.NUMBER,
            quanlity: DataTypes.NUMBER,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'CartDetails',
        },
    );
    CartDetail.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return CartDetail;
};
