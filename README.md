
---

# node-pay

## Introduction

**node-pay** is a flexible Node.js package designed for seamless integration with multiple payment gateways, such as Stripe and Paystack (with more gateways planned). This package allows you to switch between different payment providers without changing complex settings in your codebase.

## Features

- **Create Payments:** Initialize payments with ease using different payment providers.
- **Verify Payments:** Verify the status of payments securely.
- **List Payments:** Retrieve a list of all payments made through the gateway.
- **Retrieve Single Payment:** Fetch details of a specific payment.

## Installation

To install the package, use npm or yarn:

```bash
npm install node-pay
```

or

```bash
yarn add node-pay
```

## Usage

### Setting Up the Payment Provider

1. **Stripe Provider**

**JavaScript Example:**

```javascript
const { PaymentGateway } = require("node-pay"); // Ensure you are importing the class correctly
require("dotenv").config();

const stripeProvider = new PaymentGateway('stripe', process.env.STRIPE_SECRET_KEY); // Use 'new' to instantiate the class

async function runPayment() {
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
    try {
        const payment = await stripeProvider.createPayment(payload);
        console.log("Payment reference:", payment);
    } catch (error) {
        console.error("Error creating payment:", error);
    }
}

async function listPayments() {
    const params = { limit: 3 };
    try {
        const payments = await stripeProvider.listPayments(params);
        console.log("Payment list:", payments);
    } catch (error) {
        console.error("Error listing payments:", error);
    }
}

async function retrieveSinglePayment() {
    const transId = "cs_test_a1O7BLn85hx512NIS3zfI2AQqNpvRcgTOAwMcLyMOtWE48mpjAGzZjiUzm";
    try {
        const payment = await stripeProvider.retrieveSinglePayment(transId);
        console.log("Payment details:", payment);
    } catch (error) {
        console.error("Error retrieving payment:", error);
    }
}

async function verifyPayment() {
    const transId = "cs_test_a1O7BLn85hx512NIS3zfI2AQqNpvRcgTOAwMcLyMOtWE48mpjAGzZjiUzm";
    try {
        const payment = await stripeProvider.verifyPayment(transId);
        console.log("Payment verification:", payment);
    } catch (error) {
        console.error("Error verifying payment:", error);
    }
}

// Call the functions
runPayment();
verifyPayment();
listPayments();
retrieveSinglePayment();
```

**TypeScript Example:**

```typescript
import { PaymentGateway } from "node-pay";
import * as dotenv from 'dotenv';
dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in the environment variables");
}

// Initiate your payment provider (in this case, Stripe)
const provider = new PaymentGateway('stripe', stripeKey);

async function runPayment() {
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
    // For more information and payload details, see the official Stripe docs https://docs.stripe.com/api/checkout/sessions/create
    try {
        const payment = await provider.createPayment(payload);
        console.log("Payment reference:", payment);
    } catch (error) {
        console.error("Error creating payment:", (error as Error).message);
    }
}

async function listPayments() {
    // For more info about the params to pass, see the official docs https://docs.stripe.com/api/checkout/sessions/list
    const payload2 = { limit: 3 };
    try {
        const payments = await provider.listPayments(payload2);
        console.log("Payment list:", payments);
    } catch (error) {
        console.error("Error listing payments:", (error as Error).message);
    }
}

async function retrieveSinglePayment() {
    // For more info about verification of payment, see https://docs.stripe.com/api/checkout/sessions/retrieve
    const transId = "cs_test_a1O7BLn85hx512NIS3zfI2AQqNpvRcgTOAwMcLyMOtWE48mpjAGzZjiUzm";
    try {
        const payment = await provider.retrieveSinglePayment(transId);
        console.log("Payment details:", payment);
    } catch (error) {
        console.error("Error retrieving payment:", (error as Error).message);
    }
}

async function verifyPayment() {
    // For more info about verifying payment, see https://docs.stripe.com/api/checkout/sessions/retrieve
    const transId = "cs_test_a1O7BLn85hx512NIS3zfI2AQqNpvRcgTOAwMcLyMOtWE48mpjAGzZjiUzm";
    try {
        const payment = await provider.verifyPayment(transId);
        console.log("Payment verification:", payment);
    } catch (error) {
        console.error("Error verifying payment:", (error as Error).message);
    }
}

// Call the functions
runPayment();
verifyPayment();
listPayments();
retrieveSinglePayment();
```

2. **Paystack Provider**

**JavaScript Example:**

```javascript
const { PaymentGateway } = require("node-pay"); // Ensure you are importing the class correctly
require("dotenv").config();

const paystackProvider = new PaymentGateway('paystack', process.env.PAYSTACK_SECRET_KEY); // Use 'new' to instantiate the class

(async () => {
    const payload = {
        email: "customer@email.com",
        amount: "20000",
        callback_url: "https://www.google.com",
        // to add more to this payload, see official docs https://paystack.com/docs/api/transaction/#initialize
    };
    try {
        const createPayment = await paystackProvider.createPayment(payload);
        console.log("Payment reference:", createPayment);
    } catch (error) {
        console.error("Error creating payment:", error);
    }
})();

(async () => {
    // More info here https://paystack.com/docs/api/transaction/#verify
    const reference = "i3mg37nrys";
    try {
        const verifyPayment = await paystackProvider.verifyPayment(reference);
        console.log("Payment verification:", verifyPayment);
    } catch (error) {
        console.error("Error verifying payment:", error);
    }
})();

(async () => {
    // Filter params for the listPayments more info here https://paystack.com/docs/api/transaction/#list
    const params = {
        perPage: 10,
        page: 1,
        status: 'success',
        from: '2024-01-01T00:00:00.000Z',
        to: '2024-01-31T23:59:59.000Z'
    };
    try {
        const listPayments = await paystackProvider.listPayments(params);
        console.log("Payment list:", listPayments);
    } catch (error) {
        console.error("Error listing payments:", error);
    }
})();

(async () => {
    // More info here https://paystack.com/docs/api/transaction/#retrieve
    const tranId = "3806666186";
    try {
        const retrieveSinglePayment = await paystackProvider.retrieveSinglePayment(tranId);
        console.log("Payment details:", retrieveSinglePayment);
    } catch (error) {
        console.error("Error retrieving payment:", error);
    }
})();
```

**TypeScript Example:**

```typescript
import { PaymentGateway } from "node-pay";
import * as dotenv from 'dotenv';
dotenv.config();

const paystackKey = process.env.PAYSTACK_SECRET_KEY;
if (!paystackKey) {
  throw new Error("PAYSTACK_SECRET_KEY is not set in the environment variables");
}

// Initiate your payment provider (in this case, Paystack)
const provider = new PaymentGateway('paystack', paystackKey);

async function runPayment() {
    const payload = {
        email: "customer@example.com",
        amount: 2000,
        currency: 'NGN',
        callback_url: "https://www.google.com",
    };
    // For more information and payload details, see the official Paystack docs https://paystack.com/docs/api/transaction/#initialize
    try {
        const payment = await provider.createPayment(payload);
        console.log("Payment reference:", payment);
    } catch (error) {
        console.error("Error creating payment:", (error as Error).message);
    }
}

async function verifyPayment() {
    // For more info about verification of payment, see https://paystack.com/docs/api/transaction/#verify
    const reference = "i3mg37nrys";
    try {
        const payment = await

 provider.verifyPayment(reference);
        console.log("Payment verification:", payment);
    } catch (error) {
        console.error("Error verifying payment:", (error as Error).message);
    }
}

async function listPayments() {
    // Filter params for listPayments, more info here https://paystack.com/docs/api/transaction/#list
    const params = {
        perPage: 10,
        page: 1,
        status: 'success',
        from: '2024-01-01T00:00:00.000Z',
        to: '2024-01-31T23:59:59.000Z'
    };
    try {
        const payments = await provider.listPayments(params);
        console.log("Payment list:", payments);
    } catch (error) {
        console.error("Error listing payments:", (error as Error).message);
    }
}

async function retrieveSinglePayment() {
    // For more info about retrieving a single payment, see https://paystack.com/docs/api/transaction/#retrieve
    const tranId = "3806666186";
    try {
        const payment = await provider.retrieveSinglePayment(tranId);
        console.log("Payment details:", payment);
    } catch (error) {
        console.error("Error retrieving payment:", (error as Error).message);
    }
}

// Call the functions
runPayment();
verifyPayment();
listPayments();
retrieveSinglePayment();
```

## Documentation

### Methods

- **`createPayment(payload: object)`**
  - **Description:** Initiates a payment request with the provided payload. 
  - **Returns:** Payment reference object.

- **`verifyPayment(reference: string)`**
  - **Description:** Verifies the status of a payment using the provided reference or transaction ID or payement Id.
  - **Returns:** Payment verification Boolean (true if paid else false).

- **`listPayments(params: object)`**
  - **Description:** Retrieves a list of payments based on the provided parameters.
  - **Returns:** List of payments.

- **`retrieveSinglePayment(transactionId: string)`**
  - **Description:** Fetches details of a single payment using the transaction ID.
  - **Returns:** Payment details.

## Contribution

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Nwafor Glory - [GitHub](https://github.com/Nwafor6)

---
