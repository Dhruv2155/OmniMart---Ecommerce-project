 const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("./model/User");
const Product = require("./model/Product");

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        await Product.deleteMany();

        await Product.insertMany([
            {
                name: "iPhone 15",
                description: "Apple iPhone 15 128GB",
                price: 79999,
                category: "Mobiles",
                stock: 20,
                imageUrl: "https://via.placeholder.com/300"
            },
            {
                name: "Samsung Galaxy S24",
                description: "Samsung flagship smartphone",
                price: 74999,
                category: "Mobiles",
                stock: 15,
                imageUrl: "https://via.placeholder.com/300"
            },
            {
                name: "Boat Rockerz 450",
                description: "Wireless Bluetooth Headphones",
                price: 1499,
                category: "Electronics",
                stock: 50,
                imageUrl: "https://via.placeholder.com/300"
            },
            {
                name: "HP Pavilion 15",
                description: "Intel Core i5 Laptop",
                price: 62999,
                category: "Laptops",
                stock: 10,
                imageUrl: "https://via.placeholder.com/300"
            },
            {
                name: "Nike Air Max",
                description: "Comfortable running shoes",
                price: 5999,
                category: "Footwear",
                stock: 30,
                imageUrl: "https://via.placeholder.com/300"
            }
        ]);
        const users = [
    {
        name: "John Doe",
        email: "john@example.com",
        password: "john123",
        role: "user",
        verified: true
    },
    {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "jane123",
        role: "user",
        verified: true
    }
];

for (const user of users) {
    const exists = await User.findOne({ email: user.email });

    if (!exists) {
        await User.create(user);
        console.log(`${user.email} created`);
    }
}
        const adminExists = await User.findOne({
            email: "admin@example.com"
        });

        if (!adminExists) {
            await User.create({
                name: "Admin",
                email: "admin@example.com",
                password: "admin123",
                role: "admin",
                verified: true
            });

            console.log("Admin user created");
        }

        console.log("Database seeded successfully");
        process.exit(0);

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedDatabase();