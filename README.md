
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

```typescript
import { StripeProvider } from 'node-pay';

const stripe = new StripeProvider('your-stripe-api-key');

async function processPayment() {
  const payload = {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  };

  const payment = await stripe.createPayment(payload);
  console.log(payment);
}
```

2. **Paystack Provider**

```typescript
import { PaystackProvider } from 'node-pay';

const paystack = new PaystackProvider('your-paystack-api-key');

async function processPayment() {
  const payload = {
    email: 'customer@example.com',
    amount: 2000,
    currency: 'NGN',
  };

  const payment = await paystack.createPayment(payload);
  console.log(payment);
}
```

### JavaScript Example

Here’s how you can use the `node-pay` package in a JavaScript application:

```javascript
const { PaymentGateway } = require("node-pay"); // Ensure you are importing the class correctly
require("dotenv").config();

const paystackProvider = new PaymentGateway("paystack", process.env.PAYSTACK_SECRET_KEY); // Use 'new' to instantiate the class

(async () => {
    const payload = {
        email: "customer@email.com",
        amount: "20000",
        callback_url: "https://www.google.com",
        // to add more to this payload, see official docs https://paystack.com/docs/api/transaction/#initialize
    };
    try {
        const createPayment = await paystackProvider.createPayment(payload);
        console.log(createPayment);
    } catch (error) {
        console.error("Error creating payment:", error);
    }
})();

(async () => {
    // More info here https://paystack.com/docs/api/transaction/#verify
    const reference = "i3mg37nrys";
    try {
        const verifyPayment = await paystackProvider.verifyPayment(reference);
        console.log(verifyPayment);
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
        console.log(listPayments);
    } catch (error) {
        console.error("Error listing payments:", error);
    }
})();

(async () => {
    // More info here https://paystack.com/docs/api/transaction/#retrieve
    const tranId = "3806666186";
    try {
        const retrieveSinglePayment = await paystackProvider.retrieveSinglePayment(tranId);
        console.log(retrieveSinglePayment);
    } catch (error) {
        console.error("Error retrieving payment:", error);
    }
})();
```

### Verifying Payments

```typescript
async function verifyPayment(paymentId: string) {
  const isVerified = await stripe.verifyPayment(paymentId);
  console.log(isVerified);
}
```

### Listing Payments

```typescript
async function listPayments() {
  const payments = await stripe.listPayments();
  console.log(payments);
}
```

### Retrieving Single Payment

```typescript
async function retrievePayment(paymentId: string) {
  const payment = await stripe.retrieveSinglePayment(paymentId);
  console.log(payment);
}
```

## API

### PaymentProvider Interface

The `PaymentProvider` interface defines the methods that each payment provider must implement:

```typescript
export interface PaymentProvider {
  createPayment(payload: object): Promise<string>;
  verifyPayment(paymentId: string): Promise<boolean>;
  listPayments(params: object): Promise<string>;
  retrieveSinglePayment(paymentId: string): Promise<boolean>;
}
```

### StripeProvider Class

#### Methods

- `createPayment(payload: Record<string, unknown>): Promise<any>`
- `verifyPayment(sessionId: string): Promise<boolean>`
- `listPayments(payload: Record<string, any> = {}): Promise<any>`
- `retrieveSinglePayment(paymentId: string): Promise<any>`

### PaystackProvider Class

#### Methods

- `createPayment(payload: Record<string, unknown>): Promise<string>`
- `verifyPayment(paymentId: string): Promise<boolean>`
- `listPayments(params: Record<string, any> = {}): Promise<any>`
- `retrieveSinglePayment(paymentId: string): Promise<boolean>`

## Configuration

You can set the API keys for each payment provider by passing them to the constructor when creating an instance of `StripeProvider` or `PaystackProvider`.

```typescript
const stripe = new StripeProvider('your-stripe-api-key');
const paystack = new PaystackProvider('your-paystack-api-key');
```

## Example

Here is a complete example of how to use the package with both Stripe and Paystack:

```typescript
import { StripeProvider, PaystackProvider } from 'node-pay';

const stripe = new StripeProvider('your-stripe-api-key');
const paystack = new PaystackProvider('your-paystack-api-key');

async function processStripePayment() {
  const payload = {
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  };

  const payment = await stripe.createPayment(payload);
  console.log(payment);
}

async function processPaystackPayment() {
  const payload = {
    email: 'customer@example.com',
    amount: 2000,
    currency: 'NGN',
  };

  const payment = await paystack.createPayment(payload);
  console.log(payment);
}

processStripePayment();
processPaystackPayment();
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---