import { StripeProvider } from '../src';
import Stripe from 'stripe';

// Mock the entire Stripe module
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
        retrieve: jest.fn(),
        list: jest.fn(),
      },
    },
  }));
});

describe('StripeProvider', () => {
  let stripeProvider: StripeProvider;
  let mockStripe: jest.Mocked<Partial<Stripe>>;
  const mockApiKey = 'test_stripe_api_key';

  beforeEach(() => {
    mockStripe = new (Stripe as jest.MockedClass<typeof Stripe>)(mockApiKey);
    stripeProvider = new StripeProvider(mockApiKey);
    (stripeProvider as any).stripe = mockStripe;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const mockPayload = {
        line_items: [{ price: 'price_123', quantity: 1 }],
        mode: 'payment',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      };
      const mockResponse = {
        id: 'cs_test_123',
        object: 'checkout.session',
        payment_status: 'unpaid',
      };

      (mockStripe.checkout!.sessions!.create as jest.Mock).mockResolvedValue(mockResponse as any);

      const result = await stripeProvider.createPayment(mockPayload);
      expect(result).toEqual(mockResponse);
      expect(mockStripe.checkout!.sessions!.create).toHaveBeenCalledWith(mockPayload);
    });

    it('should throw an error if payment creation fails', async () => {
      const mockPayload = { /* ... */ };
      const mockError = new Error('Payment creation failed');

      (mockStripe.checkout!.sessions!.create as jest.Mock).mockRejectedValue(mockError as any);

      await expect(stripeProvider.createPayment(mockPayload)).rejects.toThrow('Stripe payment creation failed: Payment creation failed');
    });
  });

  describe('verifyPayment', () => {
    it('should verify a payment successfully', async () => {
      const mockSessionId = 'cs_test_123';
      const mockSession = {
        id: mockSessionId,
        payment_status: 'paid',
      };

      (mockStripe.checkout!.sessions!.retrieve as jest.Mock).mockResolvedValue(mockSession as any);

      const result = await stripeProvider.verifyPayment(mockSessionId);
      expect(result).toBe(true);
      expect(mockStripe.checkout!.sessions!.retrieve).toHaveBeenCalledWith(mockSessionId);
    });

    it('should return false for unpaid session', async () => {
      const mockSessionId = 'cs_test_123';
      const mockSession = {
        id: mockSessionId,
        payment_status: 'unpaid',
      };

      (mockStripe.checkout!.sessions!.retrieve as jest.Mock).mockResolvedValue(mockSession as any);

      const result = await stripeProvider.verifyPayment(mockSessionId);
      expect(result).toBe(false);
    });

    it('should throw an error if verification fails', async () => {
      const mockSessionId = 'cs_test_123';
      const mockError = new Error('Verification failed');

      (mockStripe.checkout!.sessions!.retrieve as jest.Mock).mockRejectedValue(mockError);

      await expect(stripeProvider.verifyPayment(mockSessionId)).rejects.toThrow('Stripe payment verification failed: Verification failed');
    });
  });

  describe('listPayments', () => {
    it('should list payments successfully', async () => {
      const mockPayload = { limit: 10 };
      const mockResponse = {
        object: 'list',
        data: [
          { id: 'cs_test_123', payment_status: 'paid' },
          { id: 'cs_test_456', payment_status: 'unpaid' },
        ],
      };

      (mockStripe.checkout!.sessions!.list as jest.Mock).mockResolvedValue(mockResponse as any);

      const result = await stripeProvider.listPayments(mockPayload);
      expect(result).toEqual(mockResponse);
      expect(mockStripe.checkout!.sessions!.list as jest.Mock).toHaveBeenCalledWith(mockPayload);
    });

    it('should throw an error if listing payments fails', async () => {
      const mockPayload = { limit: 10 };
      const mockError = new Error('Listing failed');

      (mockStripe.checkout!.sessions!.list as jest.Mock).mockRejectedValue(mockError);

      await expect(stripeProvider.listPayments(mockPayload)).rejects.toThrow('Stripe list payments failed: Listing failed');
    });
  });

  describe('retrieveSinglePayment', () => {
    it('should retrieve a single payment successfully', async () => {
      const mockPaymentId = 'cs_test_123';
      const mockResponse = {
        id: mockPaymentId,
        payment_status: 'paid',
      };

      (mockStripe.checkout!.sessions!.retrieve as jest.Mock).mockResolvedValue(mockResponse as any);

      const result = await stripeProvider.retrieveSinglePayment(mockPaymentId);
      expect(result).toEqual(mockResponse);
      expect(mockStripe.checkout!.sessions!.retrieve as jest.Mock).toHaveBeenCalledWith(mockPaymentId);
    });

    it('should throw an error if retrieving a single payment fails', async () => {
      const mockPaymentId = 'cs_test_123';
      const mockError = new Error('Retrieval failed');

      (mockStripe.checkout!.sessions!.retrieve as jest.Mock).mockRejectedValue(mockError);

      await expect(stripeProvider.retrieveSinglePayment(mockPaymentId)).rejects.toThrow('Stripe list payments failed: Retrieval failed');
    });
  });
});