const Order = require("../model/Order");
const Product = require("../model/Product");
const User = require("../model/User");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        const orders = await Order.find({});
        const totalRevenueData = orders.reduce((acc, order) => acc + order.totalAmount, 0);
        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenueData
        })
    } catch (error) {
        return res.status(500).json({ message: 'server error' });
    }
}

module.exports = {getAdminStats}