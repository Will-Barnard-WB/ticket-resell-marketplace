import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import AllTicketsCarousel from "../components/AllTicketsCarousel";

const HomePage = () => {
  const { fetchAllProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-2">
          Browse Live Ticket Sales
        </h1>
        <p className="text-center text-xl text-gray-300 mb-6">
          Buy and sell entry tickets to club nights in Bath
        </p>

        {!isLoading && Array.isArray(products) && products.length > 0 && (
          <AllTicketsCarousel products={products} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
