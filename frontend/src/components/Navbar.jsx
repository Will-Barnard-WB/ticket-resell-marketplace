import { ShoppingCart, UserPlus, LogIn, LogOut, Lock, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
	const { user, logout } = useUserStore();
	const isAdmin = user?.role === "admin";
	const { cart } = useCartStore();

	return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800'>
			<div className='w-full px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2'>
				{/* Site Title */}
				<Link
					to='/'
					className='text-2xl font-bold text-emerald-400 text-center sm:text-left'
				>
					Bath Ticket Resale
				</Link>

				{/* Navigation */}
				<nav className='flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4'>
					{/* Dashboard for Admin OR Add Product for Customer */}
					{user && isAdmin && (
						<Link
							to={"/secret-dashboard"}
							className='bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center transition duration-300 ease-in-out'
						>
							<Lock className='mr-2' size={18} />
							Dashboard
						</Link>
					)}

					{user && !isAdmin && (
						<Link
							to={"/add-product"}
							className='bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center transition duration-300 ease-in-out'
						>
							<PlusCircle className='mr-2' size={18} />
							Sell
						</Link>
					)}

					{/* Cart */}
					{user && (
						<Link
							to={"/cart"}
							className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out relative'
						>
							<span className='mr-2'>🛒</span>
							<span>Cart</span>
							{cart.length > 0 && (
								<span className='absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'>
									{cart.length}
								</span>
							)}
						</Link>
					)}

					{/* Auth Buttons */}
					{user ? (
						<button
							className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
							onClick={logout}
						>
							<LogOut size={18} className='mr-2' />
							Log Out
						</button>
					) : (
						<>
							<Link
								to={"/signup"}
								className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
							>
								<UserPlus className='mr-2' size={18} />
								Sign Up
							</Link>
							<Link
								to={"/login"}
								className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
							>
								<LogIn className='mr-2' size={18} />
								Login
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
