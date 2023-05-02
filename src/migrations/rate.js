'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Rates', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            title: {
                type: Sequelize.STRING,
            },
            content: {
                type: Sequelize.STRING,
            },
            location: {
                type: Sequelize.INTEGER,
                defaultValue: 5,
            },
            price: {
                type: Sequelize.INTEGER,
                defaultValue: 5,
            },
            quality: {
                type: Sequelize.INTEGER,
                defaultValue: 5,
            },
            servi: {
                type: Sequelize.INTEGER,
                defaultValue: 5,
            },
            space: {
                type: Sequelize.INTEGER,
                require: true,
                defaultValue: 5,
            },
            id_branch: {
                type: Sequelize.STRING,
                require: true,
            },
            id_customer: {
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
        await queryInterface.dropTable('Rates');
    },
};
