import { PaymentProvider } from '.';
import { PaystackProvider } from '.';
import { StripeProvider } from '.';

export class PaymentGateway {
  private provider: PaymentProvider;

  constructor(providerType: 'paystack' | 'stripe', apiKey: string) {
    if (providerType === 'paystack') {
      this.provider = new PaystackProvider(apiKey);
    } else if (providerType === 'stripe') {
      this.provider = new StripeProvider(apiKey);
    } else {
      throw new Error('Invalid provider type');
    }
  };

  async createPayment(payload: object): Promise<any> {
    return this.provider.createPayment(payload);
  };

  async verifyPayment(paymentId: string): Promise<boolean> {
    return this.provider.verifyPayment(paymentId);
  };

  async listPayments(params: object): Promise<boolean> {
    return this.provider.listPayments(params);
  };
  async retrieveSinglePayment(paymentId: string): Promise<boolean> {
    return this.provider.retrieveSinglePayment(paymentId);
  }
}