import { StripeProvider } from "./src/index";
import { stripeKey } from "./config";

if (!stripeKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in the environment variables");
};
const provider = new StripeProvider(stripeKey);

const payload = {
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Sample Product',
          },
          unit_amount: 2000,
        },
        quantity: 2,
      },
    ],
    mode: 'payment',
  };
  async function runPayment() {
    try {
      const payment = await provider.createPayment(payload);
      console.log("Payment reference:", payment);
    } catch (error) {
      console.error("Error creating payment:", (error as Error).message);
    }
  }

  const payload2 = {limit:3}
  async function listPayments() {
    try {
      const payment = await provider.listPayments(payload2);
      console.log("Payment list:", payment);
    } catch (error) {
      console.error("Error listing payment:", (error as Error).message);
    }
  };

  async function retrieveSinglePayment() {
    try {
      const payment = await provider.retrieveSinglePayment("cs_test_a1O7BLn85hx512NIS3zfI2AQqNpvRcgTOAwMcLyMOtWE48mpjAGzZjiUzm");
      console.log("Payment list:", payment);
    } catch (error) {
      console.error("Error listing payment:", (error as Error).message);
    }
  };

  async function verifyPayment() {
    try {
      const payment = await provider.verifyPayment("cs_test_a1O7BLn85hx512NIS3zfI2AQqNpvRcgTOAwMcLyMOtWE48mpjAGzZjiUzm");
      console.log("Payment verify:", payment);
    } catch (error) {
      console.error("Error verifying payment:", (error as Error).message);
    }
  }

  verifyPayment();