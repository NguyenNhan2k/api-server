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
            CartDetail.belongsTo(models.Orders, { foreignKey: 'id_order', as: 'order' });
        }
    }
    CartDetail.init(
        {
            id_order: DataTypes.STRING,
            id_dish: DataTypes.STRING,
            total: DataTypes.NUMBER,
            quanlity: DataTypes.NUMBER,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'OrderDetails',
        },
    );
    CartDetail.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return CartDetail;
};
