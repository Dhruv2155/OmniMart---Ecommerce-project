const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.verified) {
                return res.status(400).json({ message: "user already exists" });
            }
            await User.findByIdAndDelete(existingUser._id)
        }


        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, salt);
        const newuser = await User.create({ name, email, password: hash_password });
        if (newuser) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            newuser.otp = otp;
            newuser.otpExpiry = Date.now() + 5 * 60 * 1000;
            await newuser.save();
            console.log("Sending OTP:", otp);
            const message = `welcome to OmniMart your otp for registeration is ${otp}`;
            try {
                await sendEmail(email, "welcome to OmniMart", message)
            } catch (emailError) {
                await User.findByIdAndDelete(newuser._id);
                return res.status(500).json({ message: "OTP email could not be sent. Please check email settings and try again." });
            }
            res.status(201).json({

                email: newuser.email,
                message: 'OTP sent successfully'
            })
        }
        else {

            res.status(400).json({ message: "invalid user data" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "server error" })
    }
}


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        console.log("Email entered:", email);
        console.log("User found:", user);

        if (user && (await bcrypt.compare(password, user.password))) {
            if (!user.verified) {
                return res.status(403).json({ message: "Please verify your OTP before logging in" });
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
        else {
            res.status(400).json({ message: "Invalid email or password" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "server error" })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);

    } catch (error) {
        res.status(500).json({ message: "server error" });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({ message: 'OTP not found. Please register again' })
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' })
        }

        if (user.otp !== String(otp).trim()) {
            return res.status(400).json({ message: 'Invalid OTP' })
        }

        user.verified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (err) { return res.status(500).json({ message: 'server error' }) }
}

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;

        await user.save();

        const message = `Your new OTP is ${otp}`;

        await sendEmail(email, "OmniMart OTP", message);

        return res.status(200).json({
            message: "OTP resent successfully"
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = {
    registerUser,
    loginUser,
    getUsers,
    verifyOtp,
    resendOtp
};