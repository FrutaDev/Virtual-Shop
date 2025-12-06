
const getAdminProducts = (req, res) => {
    req.user.getProducts()
        .then(products => {
            res.render('admin/admin-products', {
                titlePage: 'AdminProducts',
                products: products,
            });
        });
};

const editProduct = (req, res) => {
    const editMode = req.query.edit;
    const productId = req.params.productId;
    req.user.getProducts({ where: { id: productId } })
        .then(products => {
            if (!products) {
                return res.redirect('/admin/admin-products');
            }
            if (editMode) {
                return res.render('admin/add-product', {
                    titlePage: 'EditProduct',
                    product: products[0],
                    editMode: editMode,
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
};

const deleteProduct = (req, res) => {
    const productId = req.params.productId;
    req.user.getProducts({ where: { id: productId } })
        .then(products => {
            if (!products) {
                return res.redirect('/admin/admin-products');
            }
            return products[0].destroy();
        })
        // eslint-disable-next-line no-unused-vars
        .then(product => {
            return res.redirect('/admin/admin-products');
        })
        .catch(err => {
            console.log(err);
        });
};

const postEditProduct = (req, res) => {
    const { title, price, imageUrl, description } = req.body;
    const productId = req.params.productId;
    req.user.getProducts({ where: { id: productId } })
        .then(products => {
            if (!products) {
                return res.redirect('/admin/admin-products');
            }
            const product = products[0];
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            return product.save();
        })
        .then(result => {
            console.log(result);
            res.redirect('/admin/admin-products');
        })
        .catch(err => {
            console.log(err);
        });
};
const getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        titlePage: 'AddProduct',
        editMode: false,
    });
};

const postAddProduct = (req, res) => {
    const { title, price, imageUrl, description } = req.body;
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
    })
    res.redirect('/admin/add-product');
};

exports.getAdminProducts = getAdminProducts;
exports.editProduct = editProduct;
exports.postEditProduct = postEditProduct;
exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.postDeleteProduct = deleteProduct;
