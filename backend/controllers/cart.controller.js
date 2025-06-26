import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
	try {

		const currentDate = new Date();

		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		const availableProducts = products.filter((product) => new Date(product.eventDate) >= currentDate &&
		!product.buyerID);

		const availableProductIds = availableProducts.map(p => p._id.toString());

		const originalCartIds = req.user.cartItems.map(id => id.toString());

		const updatedCart = originalCartIds.filter(id =>
			availableProductIds.includes(id)
		);

		if (updatedCart.length !== originalCartIds.length) {
			req.user.cartItems = updatedCart;
			await req.user.save();
		}

		const cartItems = availableProducts.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON()};
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		const existingItem = user.cartItems.find((item) => item.id === productId);
		if (existingItem) {
			toast.error("This item is already in your basket.");
		} else {
			user.cartItems.push(productId);
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
