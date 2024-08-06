import { PaymentProvider } from './types';
import https from 'https';

export class PaystackProvider implements PaymentProvider {
  private readonly baseUrl = 'api.paystack.co';

  constructor(private readonly apiKey: string) {}

  async createPayment(payload: Record<string, unknown>): Promise<string> {
    try {
      const response = await this.makeRequest('/transaction/initialize', 'POST', payload);
      
      if (response.status && response.data && response.data.reference) {
        return response.data;
      } else {
        throw new Error('Invalid response from Paystack API');
      }
    } catch (error) {
      throw new Error(`Paystack payment creation failed: ${(error as Error).message}`);
    }
  };

  async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      const path = `/transaction/verify/${paymentId}`;
      const response = await this.makeRequest(path, 'GET');
      console.log(response, "Response from Paystack");

      return response
    } catch (error) {
      throw new Error(`Paystack payment verification failed: ${(error as Error).message}`);
    }
  };

  async listPayments(params: Record<string, any> = {}): Promise<any> {
    const query = new URLSearchParams(params).toString();
    const path = `/transaction?${query}`;

    try {
      const response = await this.makeRequest(path, 'GET');
      console.log(response, "Response from Paystack");

      return response;
    } catch (error) {
      throw new Error(`Paystack list payments failed: ${(error as Error).message}`);
    }
  };

  async retrieveSinglePayment(paymentId: string): Promise<boolean> {
    try {
      const path = `/transaction/${paymentId}`;
      const response = await this.makeRequest(path, 'GET');
      console.log(response, "Response from Paystack");

      return response
    } catch (error) {
      throw new Error(`Paystack single payment  failed: ${(error as Error).message}`);
    }
  };
  
  // async refundPayment(paymentId: string, amount: number,context:object={}): Promise<boolean> {
  //   const data = {
  //     transaction:paymentId,
  //     amount,
  //    ...context
  //   };

  //   try {
  //     const response = await this.makeRequest('/refund', 'POST', data);
  //     console.log(response, "Response from Paystack");

  //     return response
  //   } catch (error) {
  //     throw new Error(`Paystack refund failed: ${(error as Error).message}`);
  //   }
  // };

  private makeRequest(path: string, method: string, data?: Record<string, unknown>): Promise<any> {
    return new Promise((resolve, reject) => {
      const options: https.RequestOptions = {
        hostname: this.baseUrl,
        port: 443,
        path: `${path}`,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            resolve(parsedData);
          } catch (error) {
            reject(new Error('Failed to parse response data'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  };

  
}