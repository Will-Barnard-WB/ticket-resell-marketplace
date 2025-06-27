import Stripe from "stripe";
import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ----------------------
// 🔁 Stripe Seller Onboarding
// ----------------------
export const stripeOnboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.stripeAccountId) {
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
      });
      user.stripeAccountId = account.id;
      await user.save();
    }

    const accountLink = await stripe.accountLinks.create({
      account: user.stripeAccountId,
      refresh_url: `${process.env.CLIENT_URL}/onboarding/refresh`,
      return_url: `${process.env.CLIENT_URL}/onboarding/return`,
      type: "account_onboarding",
    });

    res.status(200).json({ url: accountLink.url });
  } catch (err) {
    console.error("Stripe onboarding error:", err);
    res.status(500).json({ error: "Stripe onboarding failed" });
  }
};

// ----------------------
// ✅ Check Onboarding Status
// ----------------------
export const stripeOnboardStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user?.stripeAccountId) {
      return res.status(400).json({ onboarded: false });
    }

    const account = await stripe.accounts.retrieve(user.stripeAccountId);
    if (!account.details_submitted) {
      return res.status(200).json({ onboarded: false });
    }

    user.stripeOnboarded = true;
    await user.save();

    res.status(200).json({ onboarded: true });
  } catch (err) {
    console.error("Stripe status error:", err);
    res.status(500).json({ error: "Failed to check account status" });
  }
};

// ----------------------
// 💳 Create Checkout Session
// ----------------------
export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;

	for (const product of products) {
		const dbProduct = await Product.findById(product._id);
		if (!dbProduct || dbProduct.buyerID) {
		  return res.status(400).json({
			error: `Product "${product.description}" is already sold or unavailable.`,
		  });
		}
	  }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }

    // Get the first product's seller (assuming one seller per transaction)
    const product = await Product.findById(products[0]._id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const seller = await User.findById(product.sellerId);
    if (!seller?.stripeAccountId) {
      return res.status(400).json({ error: "Seller is not onboarded with Stripe" });
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // cents
      totalAmount += amount;

      return {
        price_data: {
          currency: "gbp",
          product_data: {
            description: product.description,
            name: product.category + " Ticket",
            images: [product.image],
            metadata: { productId: product._id.toString() },
          },
          unit_amount: amount,
        },
        quantity: 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      payment_intent_data: {
        application_fee_amount: Math.round(totalAmount * 0.1), // 10% platform fee
        transfer_data: {
          destination: seller.stripeAccountId,
        },
      },
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        sellerId: seller._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: 1,
            price: p.price,
          }))
        ),
      },
    });

    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }

    res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({ message: "Error processing checkout", error: error.message });
  }
};

// ----------------------
// ✅ Handle Checkout Success
// ----------------------
export const checkoutSuccess = async (req, res) => {
	try {
	  const { sessionId } = req.body;
	  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
	  if (session.payment_status === "paid") {
		if (session.metadata.couponCode) {
		  await Coupon.findOneAndUpdate(
			{
			  code: session.metadata.couponCode,
			  userId: session.metadata.userId,
			},
			{
			  isActive: false,
			}
		  );
		}
  
		const products = JSON.parse(session.metadata.products);
  
		// Fetch full product details including ticketImageUrl
		const productDetails = await Promise.all(
		  products.map(async (product) => {
			const dbProduct = await Product.findById(product.id);
			return {
			  id: product.id,
			  price: product.price,
			  image: dbProduct?.image || null,
			};
		  })
		);
  
		const newOrder = new Order({
		  user: session.metadata.userId,
		  products: products.map((product) => ({
			product: product.id,
			quantity: 1,
			price: product.price,
		  })),
		  totalAmount: session.amount_total / 100,
		  stripeSessionId: sessionId,
		});
  
		await newOrder.save();
  
		res.status(200).json({
		  success: true,
		  message: "Payment successful, order created.",
		  orderId: newOrder._id,
		  products: productDetails, // Include ticket image URLs here
		});
	  } else {
		res.status(400).json({ success: false, message: "Payment not completed" });
	  }
	} catch (error) {
	  console.error("Error processing successful checkout:", error);
	  res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
  };
  
  

export const handleStripeWebhook = async (req, res) => {
	const sig = req.headers["stripe-signature"];
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
	let event;
  
	try {
	  event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
	} catch (err) {
	  console.error("Webhook Error:", err.message);
	  return res.status(400).send(`Webhook Error: ${err.message}`);
	}
  
	// ✅ Payment successful event
	if (event.type === "checkout.session.completed") {
	  const session = event.data.object;
  
	  const products = JSON.parse(session.metadata.products);
  
	  for (const item of products) {
		// Mark product as sold
		await Product.findByIdAndUpdate(item.id, {
		  buyerID: session.metadata.userId,
		});
	  }
  
	  // Save order (if not already handled)
	  const existingOrder = await Order.findOne({ stripeSessionId: session.id });
	  if (!existingOrder) {
		await Order.create({
		  user: session.metadata.userId,
		  products: products.map(p => ({
			product: p.id,
			quantity: 1,
			price: p.price,
		  })),
		  totalAmount: session.amount_total / 100,
		  stripeSessionId: session.id,
		});
	  }
  
	  // Mark coupon as used
	  if (session.metadata.couponCode) {
		await Coupon.findOneAndUpdate(
		  {
			code: session.metadata.couponCode,
			userId: session.metadata.userId,
		  },
		  { isActive: false }
		);
	  }
	}
  
	res.status(200).send("Webhook received");
  };
  

// ----------------------
// 🔧 Helpers
// ----------------------
async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });

  await newCoupon.save();
  return newCoupon;
}
