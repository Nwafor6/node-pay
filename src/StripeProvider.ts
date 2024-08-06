import { PaymentProvider} from '.';
import Stripe from 'stripe';

export class StripeProvider implements PaymentProvider {
    private readonly baseUrl = 'api.stripe.com';
    private stripe: Stripe;
  
    constructor(private readonly apiKey: string) {
        this.stripe = new Stripe(apiKey);
    }
  
    async createPayment(payload: Record<string, unknown>): Promise<any> {
      try {

        const resp = await this.stripe.checkout.sessions.create({
            ...payload
        });
        return resp;
      } catch (error) {
        throw new Error(`Stripe payment creation failed: ${(error as Error).message}`);
      }
    };
  
    async verifyPayment(sessionId: string): Promise<boolean> {
        try {
          const session = await this.stripe.checkout.sessions.retrieve(sessionId);    
          if (session.payment_status === 'paid') {
            return true;
          } else {
            return false;
          }
        } catch (error) {
          throw new Error(`Stripe payment verification failed: ${(error as Error).message}`);
        }
      }
  
    async listPayments(payload: Record<string, any> = {}): Promise<any> {  
      try {
        const response = await this.stripe.checkout.sessions.list({...payload});  
        return response;
      } catch (error) {
        throw new Error(`Stripe list payments failed: ${(error as Error).message}`);
      }
    };
  
    async retrieveSinglePayment(paymentId: string): Promise<any> {
        try {
            const response = await this.stripe.checkout.sessions.retrieve(paymentId);  
            return response;
        } catch (error) {
            throw new Error(`Stripe list payments failed: ${(error as Error).message}`);
        }
    };   
}