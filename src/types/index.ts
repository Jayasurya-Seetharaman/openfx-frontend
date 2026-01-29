export interface Quote {
  quoteId: string;
  rate: number;
  fees: number;
  totalPayable: number;
  expiresAt: string;
  sourceCurrency: string;
  destCurrency: string;
  sourceAmount: number;
}

export interface QuoteParams {
  sourceCurrency: string;
  destCurrency: string;
  amount: number;
}

export type TransactionStatus = 'processing' | 'sent' | 'settled' | 'failed';

export interface StatusHistoryItem {
  status: TransactionStatus;
  timestamp: string;
}

export interface Transaction {
  transactionId: string;
  status: TransactionStatus;
  updatedAt: string;
  statusHistory: StatusHistoryItem[];
  failureReason?: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: TransactionStatus;
}

export interface ApiError {
  message: string;
  code?: string;
}
