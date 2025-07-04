import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import InfoPage from "./pages/InfoPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import AddProductPage from "./pages/AddProductPage";
import CategoryPage from "./pages/CategoryPage";

import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

function App() {
	const { user, checkAuth, checkingAuth } = useUserStore();
	const { getCartItems } = useCartStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;
		getCartItems();
	}, [getCartItems, user]);

	if (checkingAuth) return <LoadingSpinner />;

	return (
		<div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
			{/* Background gradient */}
			<div className='absolute inset-0 -z-10'>
				<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
			</div>

			{/* Navbar spacing — make it smaller on mobile */}
			<div className='relative z-10 pt-16 sm:pt-20 px-4 sm:px-6'>
				<Navbar />
				<div className='max-w-7xl mx-auto w-full'>
					<Routes>
						<Route path='/' element={user ? <HomePage /> : <InfoPage />} />
						<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
						<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
						<Route
							path='/secret-dashboard'
							element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
						/>
						<Route
							path='/add-product'
							element={user ? <AddProductPage /> : <Navigate to='/login' />}
					/>
						<Route path='/category/:category' element={<CategoryPage />} />
						<Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
						<Route
							path='/purchase-success'
							element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
						/>
						<Route
							path='/purchase-cancel'
							element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />}
						/>
					</Routes>
				</div>
			</div>
			<Toaster position='top-center' reverseOrder={false} />
		</div>
	);
}

export default App;
