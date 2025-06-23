import { PlusCircle, ShoppingBasket } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import CreateProductForm from "../components/CreateProductForm";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import ProductCard from "../components/ProductCard"; // Assumes you have this
import LoadingSpinner from "../components/LoadingSpinner";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "my-products", label: "My Listings", icon: ShoppingBasket },
];

const AddProductPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts, products, loading } = useProductStore();
	const { user } = useUserStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	const myProducts = products.filter((product) => product.userId === user?.id);

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					My Seller Page
				</motion.h1>

				<div className='flex justify-center mb-8'>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							<tab.icon className='mr-2 h-5 w-5' />
							{tab.label}
						</button>
					))}
				</div>

				{/* Tab Content */}
				{activeTab === "create" && <CreateProductForm />}

				{activeTab === "my-products" && (
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
						{loading ? (
							<LoadingSpinner />
						) : myProducts.length > 0 ? (
							myProducts.map((product) => (
								<ProductCard key={product.id} product={product} />
							))
						) : (
							<p className='text-gray-400 text-center w-full col-span-full'>
								You haven’t listed any products yet.
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default AddProductPage;
