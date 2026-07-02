const { admin } = require("../middleware/adminMiddleware");
const { protect } = require("../middleware/authMiddleware");
const Order = require("../model/Order");
const Product = require("../model/Product")
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose")
const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { items, totalAmount, address, paymentId } = req.body;

        if (!items || items.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        session.startTransaction();

        for (const item of items) {

            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: item.productId,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: {
                        stock: -item.quantity
                    }
                },
                {
                    new: true,
                    session
                }
            );

            if (!updatedProduct) {
                throw new Error("One or more products are out of stock.");
            }
        }

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            address,
            paymentId
        });

        await order.save({ session });

       
        await session.commitTransaction();
        session.endSession();

        // Email after successful commit
        const message = `
Dear ${req.user.name},

Thank you for shopping with us! We're pleased to let you know that your order has been successfully placed.

Order Details:
- Order ID: ${order._id}
- Order Date: ${new Date(order.createdAt).toDateString()}
- Total Amount: ₹${order.totalAmount}

Shipping Address:
${order.address.fullName}
${order.address.street}
${order.address.city}
${order.address.postalCode}
${order.address.country}

We are currently processing your order and will notify you once it has been shipped.

Thank you for choosing us!

Best regards,
Team OmniMart
`;
        
try {
    await sendEmail(req.user.email, "Order Placed", message);
} catch (err) {
    console.error("Email sending failed:", err);
}
        return res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {

    if (session.inTransaction()) {
        await session.abortTransaction();
    }

    session.endSession();

    console.error(error);

    return res.status(500).json({
        message: error.message
    });
}
};

const myOrders = async (req,res) => {
    try{
        const orders = await Order.find({user: req.user._id}).populate('items.productId' , 'name price')
        return res.json(orders);
    }catch(error){
        console.log(error);
       return res.status(500).json({message:'server error'});
    }
}

const getOrders = async(req,res) =>{
    try {
        const orders = await Order.find({}).populate('user', 'id name');
        return res.json(orders);
    } catch (error) {
        return res.status(500).json({message:'server error'});
    }
}
const updateOrderStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const order = await Order.findById(req.params.id);
        if(order){
            order.status = status,
            await order.save();
            return res.json({message:'Order Status Updated',order});
        }
        else{
            return res.status(404).json({message:'order not found'})
        }
        
    } catch (error) {
        console.error(error);
         return res.status(500).json({message:'server error'});
    }
}
module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus
}