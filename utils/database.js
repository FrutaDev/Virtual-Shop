const Sequelize = require('sequelize');
const env = require('getenv');


const sequelize = new Sequelize(
    'shop',
    'root',
    env('sqlSecret'),
    {
        dialect: 'mysql',
        host: 'localhost'
    }
)
module.exports = sequelize;