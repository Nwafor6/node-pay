export interface PaymentProvider {
    createPayment(payload:object): Promise<string>;
    verifyPayment(paymentId: string): Promise<boolean>;
    listPayments(params:object): Promise<string>;
    retrieveSinglePayment(paymentId: string): Promise<boolean>;
    // refundPayment(paymentId: string, amount: number,context:object): Promise<boolean>;
  };

export interface PaymentResult {
  id: string;
  amount: number;
  currency: string;
  status: string;
}