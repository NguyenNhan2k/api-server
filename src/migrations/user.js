'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
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
            },
            login_type: {
                type: Sequelize.STRING,
                defaultValue: 'local',
            },
            id_google: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            url_img: {
                type: Sequelize.STRING,
                defaultValue: 'user.png',
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
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Users');
    },
};
