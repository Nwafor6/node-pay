import { PaystackProvider } from "./src/index";
import { apiKey } from "./config";

if (!apiKey) {
  throw new Error("PAYSTACK_SECRET_KEY is not set in the environment variables");
}

const provider = new PaystackProvider(apiKey);

const payload = {
  email: "customer@email.com",
  amount: "20000",
  callback_url:"https://www.google.com"
};

async function runPayment() {
  try {
    const payment = await provider.createPayment(payload);
    console.log("Payment reference:", payment);
  } catch (error) {
    console.error("Error creating payment:", (error as Error).message);
  }
}
const reference = "i3mg37nrys"
const amount = 10000;
const params = {
  perPage: 10,
  page: 1,
  status: 'success',
  from: '2024-01-01T00:00:00.000Z',
  to: '2024-01-31T23:59:59.000Z'
};
async function verifyPayment() {
    try {
      const payment = await provider.verifyPayment(reference);
      console.log("Payment reference:", payment);
    } catch (error) {
      console.error("Error verifying payment:", (error as Error).message);
    }
  };

  // async function refundPayment() {
  //   try {
  //     const payment = await provider.refundPayment(reference, amount, {completePayload:true});
  //     console.log("Payment reference:", payment);
  //   } catch (error) {
  //     console.error("Error verifying payment:", (error as Error).message);
  //   }
  // }
  async function listPayments() {
    try {
      const payment = await provider.listPayments({});
      console.log("Payment reference:", payment);
    } catch (error) {
      console.error("Error verifying payment:", (error as Error).message);
    }
  }
  
  async function retrieveSinglePayment() {
    try {
      const payment = await provider.retrieveSinglePayment("3806666186");
      console.log("Payment reference:", payment);
    } catch (error) {
      console.error("Error verifying payment:", (error as Error).message);
    }
  };

  
  retrieveSinglePayment();