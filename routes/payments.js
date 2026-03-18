import express from "express";
import dotenv from "dotenv";
import { Client, Environment } from "square";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const router = express.Router();

// Square client
const client = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Production
});

// POST /api/pay
router.post("/", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const idempotencyKey = uuidv4();

    const response = await client.paymentsApi.createPayment({
      idempotencyKey,
      sourceId: req.body.sourceId, // from Web Payments SDK
      amountMoney: {
        amount: Math.round(amount * 100), // convert to cents
        currency: "USD"
      }
    });

    res.json({
      success: true,
      payment: response.result.payment
    });

  } catch (error) {
    console.error("Square payment error:", error);
    res.status(500).json({
      error: "Payment failed",
      details: error.message
    });
  }
});

export default router;
