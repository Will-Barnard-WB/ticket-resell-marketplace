
import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession, stripeOnBoard, getStripeAccountStatus, handleStripeWebhook} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);

router.post("/onboard", protectRoute, stripeOnBoard);
router.get("/account-status", protectRoute, getStripeAccountStatus);
router.post("/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);



export default router;
