const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const productController = require('../controllers/product');

router.post('/signup', userController.signup);
 
router.post('/login', userController.login);

router.post('/products/new', userController.allowIfLoggedin, userController.grantAccess('createOwn', 'product'), productController.createProduct);
 
router.get('/products', userController.allowIfLoggedin, userController.grantAccess('readAny', 'product'), productController.getProducts);

router.get('/product/:productId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'product'), productController.getProduct);
 
router.put('/product/:productId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'product'), productController.updateProduct);
 
router.delete('/product/:productId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'product'), productController.deleteProduct);
 
module.exports = router;