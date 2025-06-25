import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProductsByCategory,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllProducts); // removed admin here
router.get("/category/:category", getProductsByCategory);
router.post("/", protectRoute, createProduct); // removed admin perms
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;