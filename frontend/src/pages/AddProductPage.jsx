import { PlusCircle, ShoppingBasket, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import CreateProductForm from "../components/CreateProductForm";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import LoadingSpinner from "../components/LoadingSpinner";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "my-products", label: "My Listings", icon: ShoppingBasket },
];

const AddProductPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts, products, loading, deleteProduct } = useProductStore();
  const { user } = useUserStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const myProducts = products.filter(
    (product) => product?.sellerId?.toString() === user?._id?.toString()
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-8 text-emerald-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          My Seller Page
        </motion.h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
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
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "create" && <CreateProductForm />}

        {activeTab === "my-products" && (
          <motion.div
            className="space-y-4 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {loading ? (
              <LoadingSpinner />
            ) : myProducts.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                You haven’t listed any products yet.
              </p>
            ) : (
              myProducts.map((product) => {
                const eventDate = new Date(product.eventDate);
                const today = new Date();
                // Zero out time for date comparison
                eventDate.setHours(0, 0, 0, 0);
                today.setHours(0, 0, 0, 0);

                // Determine status
                let status = "Active";
                if (product.buyerID) {
                  status = "Sold";
                } else if (eventDate < today) {
                  status = "Expired";
                }

                // Deletable if active and not sold
                const deletable = status === "Active" && !product.buyerID;

                return (
                  <div
                    key={product._id}
                    className="flex items-start bg-gray-800 rounded-xl p-4 shadow-md space-x-4"
                  >
                    <img
                     src={`/categories/${product.category.toLowerCase()}.jpg`}
					 alt={product.category}
					 className="w-20 h-20 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-emerald-400 text-sm italic">{product.category}</p>
                      <p className="text-emerald-400 text-sm">
                        Price: £{product.price.toFixed(2)} 
                      </p>
					  <p className="text-emerald-400 text-sm">
						Event Date:{" "} {eventDate.toLocaleDateString()}
					  </p>
					  <p className="text-white-300 text-sm">{product.description}</p>
                      <p
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                          status === "Active"
                            ? "bg-green-600 text-green-100"
                            : status === "Sold"
                            ? "bg-blue-600 text-blue-100"
                            : "bg-red-600 text-red-100"
                        }`}
                      >
                        {status}
                      </p>
                    </div>
                    <div className="pl-2 self-start">
                      {deletable ? (
                        <button
                          onClick={() => {
                            if (
                              window.confirm("Are you sure you want to delete this product?")
                            ) {
                              deleteProduct(product._id);
                            }
                          }}
                          className="text-red-400 hover:text-red-300"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500 italic select-none">Locked</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AddProductPage;
