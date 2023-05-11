'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Cart.belongsTo(models.Customers, { foreignKey: 'id_customer', as: 'customer' });
            Cart.belongsTo(models.Branchs, { foreignKey: 'id_branch', as: 'branch' });
            Cart.hasMany(models.CartDetails, { foreignKey: 'id_cart', as: 'detailCart' });
        }
    }
    Cart.init(
        {
            id_customer: DataTypes.STRING,
            id_branch: DataTypes.STRING,
            total: DataTypes.NUMBER,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Carts',
        },
    );
    Cart.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return Cart;
};
