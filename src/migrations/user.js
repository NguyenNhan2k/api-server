'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            fullName: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
                require: true,
            },
            password: {
                type: Sequelize.STRING,
                require: true,
            },
            address: {
                type: Sequelize.STRING,
            },
            url_img: {
                type: Sequelize.STRING,
                defaultValue: '/img/user.png',
            },
            phone: {
                type: Sequelize.INTEGER,
            },
            id_role: {
                type: Sequelize.STRING,
                defaultValue: 'R3',
            },
            refresh_token: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                allowNull: false,
                type: 'TIMESTAMP',
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    },
};
