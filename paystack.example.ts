import { PaymentGateway } from "./src/index";
import { apiKey } from "./config";

if (!apiKey) {
  throw new Error("PAYSTACK_SECRET_KEY is not set in the environment variables");
}

// initiate you payemnt provider (in this case paystack)
const provider = new PaymentGateway('paystack', apiKey);

const payload = {
  email: "customer@email.com",
  amount: "20000",
  callback_url:"https://www.google.com",
  // to add more to this payload, see official docs https://paystack.com/docs/api/transaction/#initialize
};

async function runPayment() {
  try {
    const payment = await provider.createPayment(payload);
    console.log("Payment reference:", payment);
  } catch (error) {
    console.error("Error creating payment:", (error as Error).message);
  }
};

// MOre info here https://paystack.com/docs/api/transaction/#verify
const reference = "i3mg37nrys";
async function verifyPayment() {
    try {
      const payment = await provider.verifyPayment(reference);
      console.log("Payment verification:", payment);
    } catch (error) {
      console.error("Error verifying payment:", (error as Error).message);
    }
  };

// filter params for the listPayments more info here https://paystack.com/docs/api/transaction/#list
const params = {
    perPage: 10,
    page: 1,
    status: 'success',
    from: '2024-01-01T00:00:00.000Z',
    to: '2024-01-31T23:59:59.000Z'
};
async function listPayments() {
    try {
      const payment = await provider.listPayments(params);
      console.log("Payment lists:", payment);
    } catch (error) {
      console.error("Error listing payment:", (error as Error).message);
    }
  }

  // more info about paystack single transactions here  https://paystack.com/docs/api/transaction/#fetch
const transId = "3806666186"
async function retrieveSinglePayment() {
    try {
      const payment = await provider.retrieveSinglePayment(transId);
      console.log("Payment retrieve:", payment);
    } catch (error) {
      console.error("Error retrieval payment:", (error as Error).message);
    }
  };

// call the functions
runPayment()
verifyPayment()
listPayments()
retrieveSinglePayment()