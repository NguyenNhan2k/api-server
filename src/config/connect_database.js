const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Web_Food', 'root', null, {
    host: 'localhost',
    dialect:'mysql'
  });
const connectDatabase = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
module.exports = {connectDatabase}