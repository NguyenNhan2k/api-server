'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    class Staff extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Staff.belongsTo(models.Role, { foreignKey: 'id_role', targetKey: 'code', as: 'role' });
        }
    }
    Staff.init(
        {
            fullName: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                validate: {
                    isEmail: true,
                },
                unique: {
                    msg: 'Email address already in use!',
                },
            },
            password: DataTypes.STRING,
            address: DataTypes.STRING,
            phone: DataTypes.STRING,
            url_img: DataTypes.STRING,
            refresh_token: DataTypes.STRING,
            id_role: DataTypes.STRING,
        },
        {
            sequelize,
            paranoid: true,
            deletedAt: 'destroyTime',
            modelName: 'Staffs',
        },
    );
    Staff.beforeCreate((user, _) => {
        return (user.id = uuid());
    });
    return Staff;
};
