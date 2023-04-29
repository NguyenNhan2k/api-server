'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Dishs', {
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
            id_branch: {
                type: Sequelize.STRING,
                require: true,
            },
            id_categori: {
                type: Sequelize.STRING,
            },
            price: {
                type: Sequelize.INTEGER,
                require: true,
            },
            avatar: {
                type: Sequelize.STRING,
                require: true,
            },
            sale: {
                type: Sequelize.INTEGER,
                require: true,
            },
            avatar: {
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
            destroyTime: {
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Dishs');
    },
};
