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
            Branch.belongsTo(models.Stores, { foreignKey: 'id_store', targetKey: 'id', as: 'store' });
            Branch.hasMany(models.Rates, { foreignKey: 'id_branch', as: 'rates' });
        }
    }
    Branch.init(
        {
            name: DataTypes.STRING,
            province: DataTypes.STRING,
            district: DataTypes.STRING,
            ward: DataTypes.STRING,
            street: DataTypes.STRING,
            startTime: DataTypes.STRING,
            endTime: DataTypes.STRING,
            avatar: DataTypes.STRING,
            id_store: DataTypes.STRING,
            link: DataTypes.STRING(1234),
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
