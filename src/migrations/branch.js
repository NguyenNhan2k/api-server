'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Branchs', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            name: {
                type: Sequelize.STRING,
            },
            avatar: {
                type: Sequelize.STRING,
            },
            startTime: {
                type: Sequelize.TIME,
            },
            endTime: {
                type: Sequelize.TIME,
            },
            id_store: {
                type: Sequelize.STRING,
            },
            province: {
                type: Sequelize.STRING,
                defaultValue: 'Thành phố Cần thơ',
            },
            district: {
                type: Sequelize.STRING,
                require: true,
            },
            link: {
                type: Sequelize.STRING(1234),
            },
            ward: {
                type: Sequelize.STRING,
                require: true,
            },
            street: {
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
        await queryInterface.dropTable('Branchs');
    },
};
