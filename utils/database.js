const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_shopping', 'root', '##83Curt83##', {
    dialect: "mysql",
    host: "localhost"
});

module.exports = sequelize;