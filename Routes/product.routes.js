const express = require('express');
const router = express.Router();
const productServices = require('../Controllers/product.controllers');

router
    .get('/get', productServices.getAllProducts)
    .get('/getDetails', productServices.getProductDetails)
    .get('/getDetails/:productId', productServices.getProductDetails)
    .post('/create', productServices.createProduct)
    .put('/update', productServices.updateProduct)
    .delete('/delete', productServices.deleteProduct)

module.exports = router;