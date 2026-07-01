const Razorpay = require('razorpay');
const crypto = require('crypto')
const dotenv = require('dotenv')

const createdOrder = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.VITE_RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const options = {
            amount: req.body.amount * 100, // smallest currency unit (paise)
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex')
        }

        const order = await instance.orders.create(options);
        return res.status(200).json(order);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'server error' })
    }
}

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const generated_sign = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(razorpay_order_id+"|"+razorpay_payment_id).digest("hex");
        if(generated_sign === razorpay_signature) {
            
            return res.status(200).json({message:" payment verified succesfully"});
        }
        else{
            return res.status(400).json({message :'payment verification failed'})
        }

    } catch (error) {
        return res.status(500).json({ message: 'server error' })

    }
}
module.exports = {createdOrder,verifyPayment}