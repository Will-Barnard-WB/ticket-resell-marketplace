import { redis } from '../lib/redis.js';
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json( {products});
    }catch(error){
        res.status(500).json( {message: "Server error", error: error.message});
    }
};

export const createProduct = async (req, res) => {
    try {
        const {description, price, image, category, eventDate} = req.body;
        
        const sellerId = req.user?._id;
        if (!sellerId){
            return res.status(401).json({ message: "Unauthorized: Seller not identified" });
        }

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder: "products"});
        }

        const product = await Product.create({
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
            sellerId,
            buyerId: null,
            eventDate
        })

        res.status(201).json(product);
    } catch (error){
        res.status(500).json( {message: "Server error", error: error.message});
    }
};
export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const eventDate = new Date(product.eventDate);
		eventDate.setHours(0, 0, 0, 0);

		// Prevent deletion if product is sold or expired
		if (product.buyerID || eventDate < today) {
			return res.status(400).json({ message: "Cannot delete sold or expired product" });
		}

		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
			} catch (error) {
				// Optional: log error but don't block deletion
				console.error("Cloudinary delete error:", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);
		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductsByCategory = async (req, res) => {
    const category = req.params.category;
    try{

        const products = await Product.find({category});
        res.json( {products});
    } catch(error){
        res.status(500).json({message : "Server error", error: error.message});
    }
};
