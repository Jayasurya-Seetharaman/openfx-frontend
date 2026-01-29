import type { Quote, QuoteParams, PaymentResponse, Transaction } from '../types';
import { mockGetQuote, mockSubmitPayment, mockGetTransactionStatus } from './mockApi';

// API client that uses mock implementations
// In a real app, these would make actual HTTP requests

export const getQuote = async (params: QuoteParams): Promise<Quote> => {
  return mockGetQuote(params);
};

export const submitPayment = async (quoteId: string): Promise<PaymentResponse> => {
  return mockSubmitPayment(quoteId);
};

export const getTransactionStatus = async (transactionId: string): Promise<Transaction> => {
  return mockGetTransactionStatus(transactionId);
};
