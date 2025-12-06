const express = require('express');
const path = require('path');

const app = express();
const parser = require('body-parser');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const OrderItem = require('./models/order-item');
const Order = require('./models/order');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.set('view engine', 'ejs');
// eslint-disable-next-line no-undef
app.set('views', path.join(__dirname, 'views'));

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')));
app.use(parser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404).render('404', {
    titlePage: '404',
  });
});

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  // eslint-disable-next-line no-unused-vars
  .then(result => {
    return User.findByPk(1)
  })
  .then(user => {
    if (!user) {
      return User.create({
        name: 'Ronaldo',
        email: 'ronaldo@gmail.com',
      });
    }
    return user;
  })
  .then(user => {
    return user.getCart().then(cart => {
      if (!cart) {
        return user.createCart();
      }
      return cart;
    });
  })
  .then(() => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
