const Sequelize = require('sequelize');
const env = require('getenv');


const sequelize = new Sequelize(
    'shop',
    env('USERDB'),
    env('sqlSecret'),
    {
        dialect: 'mysql',
        host: 'localhost'
    }
)
module.exports = sequelize;