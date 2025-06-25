import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			// add to cart
			addToCart(product);
		}
	};

	const getProductStatus = (product) => {
		if (product.buyerId) {
			return { label: 'Sold', color: 'text-red-500' };
		}
		if ((new Date(product.eventDate)).setHours(0,0,0,0) < (new Date()).setHours(0,0,0,0)) {
			return { label: 'Expired', color: 'text-yellow-400' };
		}
		return { label: 'Available', color: 'text-green-400' };
	};
	
	const status = getProductStatus(product);

	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img
					className='object-cover w-full'
					src={`/categories/${product.category.toLowerCase()}.jpg`}
					alt='category'
				/>
			</div>
	
			<div className='mt-4 px-5 pb-5'>
				<h5 className='text-xl font-semibold tracking-tight text-emerald-400'>{product.category}</h5>
	
				<p className='mt-2 text-sm text-gray-400'>{new Date(product.eventDate).toLocaleDateString()}</p>
	
				<p className='mt-2 text-gray-300 text-sm'>{product.description}</p>
	
				<div className='mt-4 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-emerald-400'>£{product.price.toFixed(2)}</span>
					</p>
				</div>
	
				<div className='mt-4 mb-5 flex items-center justify-between'>
					<span className={`text-lg font-semibold ${status.color} whitespace-nowrap`}>{status.label}</span>
			</div>
			</div>
		</div>
	);
}

export default ProductCard;