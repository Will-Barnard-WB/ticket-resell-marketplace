
import express from "express";
import bodyParser from "body-parser";

import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession, stripeOnBoard, getStripeAccountStatus, handleStripeWebhook} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);

router.post("/onboard", protectRoute, stripeOnBoard);
router.get("/account-status", protectRoute, getStripeAccountStatus);
router.post("/webhook", protectRoute, handleStripeWebhook);

export default router;
