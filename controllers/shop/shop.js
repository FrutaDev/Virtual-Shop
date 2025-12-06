const Product = require('../../models/product');

const getAllProducts = (req, res) => {
    Product.findAll().then(products => {
        res.render('home', {
            titlePage: 'Home',
            products: products,
        });
    }).catch(err => {
        console.log(err);
    });
};
const getProducts = (req, res) => {
    res.render('404', {
        titlePage: 'En Mantenimiento',
    });
};

const getCart = (req, res) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            let totalPrice = 0;
            products.forEach(product => {
                totalPrice += product.CartItem.quantity * product.price;
            })
            res.render('shop/cart', {
                titlePage: 'Cart',
                products: products,
                totalPrice: totalPrice,
            })
        })
};

const addToCart = (req, res) => {
    const productId = req.body.productId;
    Product.findByPk(productId)
        .then(product => {
            return req.user.getCart()
                .then(cart => {
                    if (!cart) {
                        return req.user.createCart();
                    }
                    return cart;
                })
                .then(cart => {
                    return cart.getProducts({ where: { id: productId } })
                        .then(products => {
                            let productInCart = products[0];
                            if (productInCart) {
                                return productInCart.CartItem.update({ quantity: productInCart.CartItem.quantity + 1 })
                            } else {
                                return cart.addProduct(product, { through: { quantity: 1 } })
                            }
                        })
                })
                .then(() => {
                    return res.redirect('/cart');
                })
        })
        .catch(err => console.log(err))
}

const removeFromCart = (req, res) => {
    const productId = req.body.productId;
    let quantityToRemove = parseInt(req.body.quantity);
    let productInCart;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId } })
                .then(products => {
                    productInCart = products[0];
                    if (quantityToRemove > productInCart.CartItem.quantity) {
                        return productInCart.CartItem.destroy();
                    }
                    let newQuantity = productInCart.CartItem.quantity - quantityToRemove
                    return productInCart.CartItem.update({ quantity: newQuantity });
                })
                .then(() => {
                    if (productInCart.CartItem.quantity === 0) {
                        return productInCart.CartItem.destroy();
                    }
                })
                .then(() => {
                    return res.redirect('/cart');
                })
        })
        .catch(err => console.log(err))
}
const getOrders = (req, res) => {
    req.user.getOrders()
        .then(orders => {
            const orderProducts = orders.map(order => {
                return order.getProducts()
                    .then(products => {
                        return {
                            products
                        }
                    });
            });
            return Promise.all(orderProducts)
                .then(ordersData => {
                    res.render('shop/orders', {
                        titlePage: 'Orders',
                        orders: ordersData,
                    });
                })
        })
        .catch(err => console.log(err));
}

const newOrder = (req, res) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    order.addProducts(products.map(product => {
                        product.OrderItem = { quantity: product.CartItem.quantity };
                        return product;
                    }))
                })
                .then(() => {
                    return req.user.setCart(null);
                })
                .then(() => {
                    return res.redirect('/orders');
                })
        })
        .catch(err => console.log(err));
}

exports.getAllProducts = getAllProducts;
exports.getProducts = getProducts;
exports.getCart = getCart;
exports.getOrders = getOrders;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.newOrder = newOrder;