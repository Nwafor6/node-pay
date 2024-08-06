/**
 * Interface for a payment provider.
 */
export interface PaymentProvider {
  /**
   * Creates a payment with the given payload.
   * 
   * @param payload - The payment details required by the payment provider.
   * @returns A promise that resolves with the payment creation response.
   */
  createPayment(payload: object): Promise<any>;

  /**
   * Verifies a payment with the given payment ID.
   * 
   * @param paymentId - The ID of the payment to verify.
   * @returns A promise that resolves to `true` if the payment is verified, otherwise `false`.
   */
  verifyPayment(paymentId: string): Promise<boolean>;

  /**
   * Lists all payments based on the given parameters.
   * 
   * @param params - Optional parameters for listing payments.
   * @returns A promise that resolves with the list of payments.
   */
  listPayments(params: object): Promise<any>;

  /**
   * Retrieves the details of a single payment with the given payment ID.
   * 
   * @param paymentId - The ID of the payment to retrieve.
   * @returns A promise that resolves with the payment details.
   */
  retrieveSinglePayment(paymentId: string): Promise<any>;

}
