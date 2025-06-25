// lib/paystack.ts
export interface PaystackInitializeData {
  email: string;
  amount: number; // in kobo
  reference: string;
  callback_url?: string;
  metadata?: {
    donation_id: string;
    campaign_id?: string;
    donor_name?: string;
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: "success" | "failed" | "abandoned" | "pending";
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string | null;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    fees: number;
    customer: {
      id: number;
      first_name: string | null;
      last_name: string | null;
      email: string;
      customer_code: string;
      phone: string | null;
      metadata: any;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
    };
  };
}

export class PaystackAPI {
  private secretKey: string;
  private baseURL = "https://api.paystack.co";

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  async initializeTransaction(
    data: PaystackInitializeData
  ): Promise<PaystackInitializeResponse> {
    const response = await fetch(`${this.baseURL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to initialize transaction");
    }

    return response.json();
  }

  async verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    const response = await fetch(
      `${this.baseURL}/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to verify transaction");
    }

    return response.json();
  }

  async listTransactions(params?: {
    perPage?: number;
    page?: number;
    status?: string;
    from?: string;
    to?: string;
  }): Promise<any> {
    const searchParams = new URLSearchParams();

    if (params?.perPage)
      searchParams.append("perPage", params.perPage.toString());
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.status) searchParams.append("status", params.status);
    if (params?.from) searchParams.append("from", params.from);
    if (params?.to) searchParams.append("to", params.to);

    const url = `${this.baseURL}/transaction?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to list transactions");
    }

    return response.json();
  }
}

// Utility functions
export const formatAmountForPaystack = (amount: number): number => {
  // Paystack expects amount in kobo (smallest currency unit)
  return Math.round(amount * 100);
};

export const formatAmountFromPaystack = (amount: number): number => {
  // Convert from kobo to naira
  return amount / 100;
};

export const generatePaymentReference = (prefix = "CKSI"): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `${prefix}_${timestamp}_${randomStr}`;
};
