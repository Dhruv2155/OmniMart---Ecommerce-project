const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { createOrder, myOrders, getOrders, updateOrderStatus } = require('../controlller/orderController');
const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/myorders').get(protect,myOrders)

module.exports = router;