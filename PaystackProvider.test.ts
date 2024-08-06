import { PaystackProvider } from './src/index';
import https from 'https';

// Mock the https module
jest.mock('https');

describe('PaystackProvider', () => {
  let paystackProvider: PaystackProvider;
  const mockApiKey = 'test_api_key';

  beforeEach(() => {
    paystackProvider = new PaystackProvider(mockApiKey);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const mockPayload = { amount: 1000, email: 'test@example.com' };
      const mockResponse = {
        status: true,
        data: {
          reference: 'mock_reference',
          authorization_url: 'https://checkout.paystack.com/mock_url'
        }
      };

      // Mock the https.request method
      (https.request as jest.Mock).mockImplementation((options, callback) => {
        const mockRes = {
          on: jest.fn().mockImplementation((event, cb) => {
            if (event === 'data') cb(JSON.stringify(mockResponse));
            if (event === 'end') cb();
          })
        };
        callback(mockRes);
        return {
          on: jest.fn(),
          write: jest.fn(),
          end: jest.fn()
        };
      });

      const result = await paystackProvider.createPayment(mockPayload);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error if the response is invalid', async () => {
      const mockPayload = { amount: 1000, email: 'test@example.com' };
      const mockResponse = { status: false };

      (https.request as jest.Mock).mockImplementation((options, callback) => {
        const mockRes = {
          on: jest.fn().mockImplementation((event, cb) => {
            if (event === 'data') cb(JSON.stringify(mockResponse));
            if (event === 'end') cb();
          })
        };
        callback(mockRes);
        return {
          on: jest.fn(),
          write: jest.fn(),
          end: jest.fn()
        };
      });

      await expect(paystackProvider.createPayment(mockPayload)).rejects.toThrow('Invalid response from Paystack API');
    });
  });

  describe('verifyPayment', () => {
    it('should verify a payment successfully', async () => {
      const mockPaymentId = 'mock_payment_id';
      const mockResponse = {
        status: true,
        data: {
          status: 'success',
          reference: mockPaymentId
        }
      };

      (https.request as jest.Mock).mockImplementation((options, callback) => {
        const mockRes = {
          on: jest.fn().mockImplementation((event, cb) => {
            if (event === 'data') cb(JSON.stringify(mockResponse));
            if (event === 'end') cb();
          })
        };
        callback(mockRes);
        return {
          on: jest.fn(),
          write: jest.fn(),
          end: jest.fn()
        };
      });

      const result = await paystackProvider.verifyPayment(mockPaymentId);
      expect(result).toBe(true);
    });
  });

  describe('listPayments', () => {
    it('should list payments successfully', async () => {
      const mockParams = { perPage: 20, page: 1 };
      const mockResponse = {
        status: true,
        data: [
          { id: 1, amount: 1000 },
          { id: 2, amount: 2000 }
        ]
      };

      (https.request as jest.Mock).mockImplementation((options, callback) => {
        const mockRes = {
          on: jest.fn().mockImplementation((event, cb) => {
            if (event === 'data') cb(JSON.stringify(mockResponse));
            if (event === 'end') cb();
          })
        };
        callback(mockRes);
        return {
          on: jest.fn(),
          write: jest.fn(),
          end: jest.fn()
        };
      });

      const result = await paystackProvider.listPayments(mockParams);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('retrieveSinglePayment', () => {
    it('should retrieve a single payment successfully', async () => {
      const mockPaymentId = 'mock_payment_id';
      const mockResponse = {
        status: true,
        data: {
          id: mockPaymentId,
          amount: 1000,
          status: 'success'
        }
      };

      (https.request as jest.Mock).mockImplementation((options, callback) => {
        const mockRes = {
          on: jest.fn().mockImplementation((event, cb) => {
            if (event === 'data') cb(JSON.stringify(mockResponse));
            if (event === 'end') cb();
          })
        };
        callback(mockRes);
        return {
          on: jest.fn(),
          write: jest.fn(),
          end: jest.fn()
        };
      });

      const result = await paystackProvider.retrieveSinglePayment(mockPaymentId);
      expect(result).toEqual(mockResponse);
    });
  });
});