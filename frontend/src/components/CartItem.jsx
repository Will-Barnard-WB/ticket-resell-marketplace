import { Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

const CartItem = ({ item }) => {
  const { removeFromCart } = useCartStore();

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-3 md:p-4 shadow-sm">
    <div className="flex flex-row gap-4 items-stretch">
      {/* Left: Image */}
      <div className="w-20 md:w-24 flex-shrink-0">
        <img
          className="h-full w-full object-cover rounded"
          src={`/categories/${item.category.toLowerCase()}.jpg`}
          alt={item.category}
        />
      </div>

      {/* Right: Text and Actions */}
      <div className="flex flex-col justify-between flex-1">
        <div className="text-emerald-400 text-sm space-y-1">
          <p className="font-medium">{item.category}</p>
          <p>
            {new Date(item.eventDate).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="font-bold">£{item.price.toFixed(2)}</p>
        </div>

        <div className="flex justify-between items-end mt-2">
          <p className="text-xs text-gray-300 pr-4">{item.description}</p>
          <button
            className="text-sm text-red-400 hover:text-red-300"
            onClick={() => removeFromCart(item._id)}
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
)};

export default CartItem;
