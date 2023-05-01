'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Stores', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            name: {
                type: Sequelize.STRING,
                require: true,
                unique: true,
            },
            email: {
                type: Sequelize.STRING,
                require: true,
                unique: true,
            },
            avatar: {
                type: Sequelize.STRING,
                defaultValue: 'store',
            },
            phone: {
                type: Sequelize.STRING,
                require: true,
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
            destroyTime: {
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Stores');
    },
};
