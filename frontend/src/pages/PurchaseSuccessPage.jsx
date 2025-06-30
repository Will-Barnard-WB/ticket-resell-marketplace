import { useEffect, useState } from "react";
import axios from "../lib/axios"; // Your Axios config
import { useCartStore } from "../stores/useCartStore";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const { clearCart } = useCartStore();

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        const res = await axios.post("/api/payments/checkout-success", {
          sessionId,
        });

        clearCart();

        if (res.data?.ticketImageUrl) {
          // Redirect to the Cloudinary ticket image
          window.location.href = res.data.ticketImageUrl;
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong processing your order.");
        setIsProcessing(false);
      }
    };

    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      setError("No session ID found in URL.");
      setIsProcessing(false);
    }
  }, [clearCart]);

  if (isProcessing) return <div className="text-center mt-20">Processing...</div>;
  if (error) return <div className="text-red-500 text-center mt-20">{error}</div>;

  return null; // Never shown if redirect works
};

export default PurchaseSuccessPage;
