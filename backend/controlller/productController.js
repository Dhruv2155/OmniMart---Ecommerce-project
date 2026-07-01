const Product = require('../model/Product')
const cloudinary = require('../config/cloudinary')

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.json(products)
    } catch (error) {
        return res.status(500).json({ message: "server error" })
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            return res.json(product)
        }
        else {
            return res.status(404).json({ message: " Product not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: 'server error' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            
            imageUrl = result.secure_url;
        }
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        })

        const savedProduct = await product.save();
        return res.status(201).json(savedProduct);
    }
    catch (error) {
        return res.status(500).json({ message: 'server error' })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price ?? product.price;
            product.category = category || product.category;
            product.stock = stock ?? product.stock;
            if(req.file){
                const result = await cloudinary.uploader.upload(req.file.path);
               
                product.imageUrl = result.secure_url;
            }
            const updateProduct = await product.save();
            return res.json(updateProduct);
        }
        else {
           return  res.status(404).json({message : 'product not found'})
        }
    } catch (error) {
           return  res.status(500).json({message : "server error"})
    }
}

const deleteProduct = async (req,res) =>{
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            await product.deleteOne();
            return res.json({message : 'Product Terminated'})
        }
        else{
            return res.status(404).json({message:'product not found'});
        }
    } catch (error) {
        return res.status(500).json({message:'server error'})
    }
}

module.exports = {deleteProduct,updateProduct,getProducts,getProductById,createProduct}