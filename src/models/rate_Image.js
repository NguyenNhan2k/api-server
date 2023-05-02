'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class RateImgs extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            RateImgs.belongsTo(models.Rates, { foreignKey: 'id_rate', as: 'rate' });
        }
    }
    RateImgs.init(
        {
            image: DataTypes.STRING,
            id_rate: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'RateImgs',
        },
    );
    RateImgs.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return RateImgs;
};
