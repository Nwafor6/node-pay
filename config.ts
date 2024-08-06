import dotenv from "dotenv"
dotenv.config()

export const apiKey = process.env.PAYSTACK_SECRET_KEY;
export const stripeKey = process.env.STRIPE_SECRET_KEY;
