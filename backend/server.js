const path = require("path");
const express = require("express")
const cors = require("cors")
require("dotenv").config();
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/authRoutes.js")
connectDB();
const app = express();
app.use(cors(
    {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.FRONTEND_URL],

        credentials: true
    }
))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', userRoutes)
app.use('/api/products', require('./routes/productRoutes.js'))
app.use('/api/payment', require('./routes/paymentRoutes') )
app.use('/api/orders', require('./routes/orderRoutes.js'))
app.use('/api/analytics', require('./routes/analyticsRoutes.js'))


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))
    app.use("*",(req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));

    })

}
else {
    app.get('/', (req, res) => {
        res.send('OmniMart api is running in developement mode..')

    })
}
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})
