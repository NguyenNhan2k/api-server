'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Image extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Image.belongsTo(models.Dishs, { foreignKey: 'id_dish', as: 'dish' });
        }
    }
    Image.init(
        {
            image: DataTypes.STRING,
            id_dish: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Images',
        },
    );
    Image.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return Image;
};
