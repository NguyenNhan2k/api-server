'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Order.belongsTo(models.Customers, { foreignKey: 'id_customer', as: 'customer' });
            Order.hasMany(models.OrderDetails, { foreignKey: 'id_order', as: 'orderDetrails' });
        }
    }
    Order.init(
        {
            id_customer: DataTypes.STRING,
            fullName: DataTypes.STRING,
            address: DataTypes.STRING,
            phone: DataTypes.STRING,
            email: DataTypes.STRING,
            total: DataTypes.INTEGER,
            statusOrder: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Orders',
        },
    );
    Order.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return Order;
};
