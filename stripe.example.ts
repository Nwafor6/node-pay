import { PaymentGateway } from "./src/index";
import { stripeKey } from "./config";

if (!stripeKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in the environment variables");
};
// initiate you payemnt provider (in this case stripe)
const provider = new PaymentGateway('stripe', stripeKey);

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
  // for more information and payload detials see offical stripe docs https://docs.stripe.com/api/checkout/sessions/create
  async function runPayment() {
    try {
      const payment = await provider.createPayment(payload);
      console.log("Payment reference:", payment);
    } catch (error) {
      console.error("Error creating payment:", (error as Error).message);
    }
  }

// for more info about the params to pass see official docs https://docs.stripe.com/api/checkout/sessions/list
const payload2 = {limit:3}
async function listPayments() {
  try {
    const payment = await provider.listPayments(payload2);
    console.log("Payment list:", payment);
  } catch (error) {
    console.error("Error listing payment:", (error as Error).message);
  }
};

  
// for more info about verification of payment see https://docs.stripe.com/api/checkout/sessions/retrieve
const transId = "cs_test_a1O7BLn85hx512NIS3zfI2AQqNpvRcgTOAwMcLyMOtWE48mpjAGzZjiUzm"
async function retrieveSinglePayment() {
    try {
      const payment = await provider.retrieveSinglePayment(transId);
      console.log("Payment list:", payment);
    } catch (error) {
      console.error("Error listing payment:", (error as Error).message);
    }
  };

  // for more info about retrieveing single of payment see https://docs.stripe.com/api/checkout/sessions/retrieve
  async function verifyPayment() {
    try {
      const payment = await provider.verifyPayment(transId);
      console.log("Payment verify:", payment);
    } catch (error) {
      console.error("Error verifying payment:", (error as Error).message);
    }
  }

// call the functions
runPayment()
verifyPayment()
listPayments()
retrieveSinglePayment()