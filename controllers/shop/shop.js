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
    res.render('shop/orders', {
        titlePage: 'Orders',
    });
};

exports.getAllProducts = getAllProducts;
exports.getProducts = getProducts;
exports.getCart = getCart;
exports.getOrders = getOrders;
exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
