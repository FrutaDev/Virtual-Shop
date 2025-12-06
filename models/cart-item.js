const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const CartItem = sequelize.define('CartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

module.exports = CartItem;