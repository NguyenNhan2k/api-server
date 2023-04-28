'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Branch extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Branch.belongsTo(models.Stores, { foreignKey: 'id_store', targetKey: 'id', as: 'branchs' });
        }
    }
    Branch.init(
        {
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            startTime: DataTypes.STRING,
            endTimme: DataTypes.STRING,
            avatar: DataTypes.STRING,
            id_store: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Branchs',
        },
    );
    Branch.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return Branch;
};
