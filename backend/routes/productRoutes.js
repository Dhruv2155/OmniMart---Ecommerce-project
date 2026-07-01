const express = require("express")
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { getProductById, getProducts, createProduct, deleteProduct, updateProduct } = require('../controlller/productController')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
// all products
router.route('/').get(getProducts).post(protect, admin, upload.single('image'), createProduct);
//single specific product (id)
router.route('/:id').get(getProductById).put(protect, admin,upload.single('image'), updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;