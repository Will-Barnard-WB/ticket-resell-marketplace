import mongoose, { Mongoose } from "mongoose";

const productSchema = new mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		category: {
			type: String,
			required: true,
		},
		sellerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		buyerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null
		},
		eventDate: {
			type: Date,
			required: true
		}
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;