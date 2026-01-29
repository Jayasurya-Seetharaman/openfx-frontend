import type { Quote, QuoteParams, PaymentResponse, Transaction, TransactionStatus } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random ID
const generateId = (prefix: string) => `${prefix}_${Math.random().toString(36).substr(2, 9)}`;

// Store transaction creation times for status progression
const transactionTimes = new Map<string, number>();

// Simulated exchange rates
const exchangeRates: Record<string, Record<string, number>> = {
  USD: { EUR: 0.92, GBP: 0.79, INR: 83.12, USD: 1 },
  EUR: { USD: 1.09, GBP: 0.86, INR: 90.45, EUR: 1 },
  GBP: { USD: 1.27, EUR: 1.16, INR: 105.23, GBP: 1 },
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, INR: 1 },
};

export const mockGetQuote = async (params: QuoteParams): Promise<Quote> => {
  // Simulate network delay
  await delay(500 + Math.random() * 500);

  // Validate inputs
  if (!params.sourceCurrency || !params.destCurrency || !params.amount) {
    throw new Error('Missing required parameters');
  }

  if (params.amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  if (params.amount > 1000000) {
    throw new Error('Amount exceeds maximum limit');
  }

  // Get exchange rate
  const rate = exchangeRates[params.sourceCurrency]?.[params.destCurrency] || 1;
  
  // Calculate fees (2% of amount, minimum $5)
  const fees = Math.max(params.amount * 0.02, 5);
  
  // Calculate total
  const totalPayable = params.amount + fees;

  // Set expiry to 30 seconds from now
  const expiresAt = new Date(Date.now() + 30000).toISOString();

  return {
    quoteId: generateId('quote'),
    rate,
    fees: Number(fees.toFixed(2)),
    totalPayable: Number(totalPayable.toFixed(2)),
    expiresAt,
    sourceCurrency: params.sourceCurrency,
    destCurrency: params.destCurrency,
    sourceAmount: params.amount,
  };
};

export const mockSubmitPayment = async (_quoteId: string): Promise<PaymentResponse> => {
  // Simulate network delay
  await delay(1000 + Math.random() * 1000);

  // 10% chance of simulated error
  if (Math.random() < 0.1) {
    throw new Error('Payment processing failed. Please try again.');
  }

  const transactionId = generateId('txn');
  
  // Store the creation time for status progression
  transactionTimes.set(transactionId, Date.now());

  return {
    transactionId,
    status: 'processing',
  };
};

export const mockGetTransactionStatus = async (transactionId: string): Promise<Transaction> => {
  // Simulate network delay
  await delay(300 + Math.random() * 200);

  const createdAt = transactionTimes.get(transactionId) || Date.now();
  const elapsedSeconds = (Date.now() - createdAt) / 1000;

  // 5% chance of failed status (but only after processing stage)
  const shouldFail = Math.random() < 0.05 && elapsedSeconds > 3;

  let status: TransactionStatus;
  const statusHistory: Array<{ status: TransactionStatus; timestamp: string }> = [];

  if (shouldFail) {
    status = 'failed';
    statusHistory.push({
      status: 'processing',
      timestamp: new Date(createdAt).toISOString(),
    });
    statusHistory.push({
      status: 'failed',
      timestamp: new Date(createdAt + 3000).toISOString(),
    });
  } else if (elapsedSeconds < 5) {
    status = 'processing';
    statusHistory.push({
      status: 'processing',
      timestamp: new Date(createdAt).toISOString(),
    });
  } else if (elapsedSeconds < 10) {
    status = 'sent';
    statusHistory.push({
      status: 'processing',
      timestamp: new Date(createdAt).toISOString(),
    });
    statusHistory.push({
      status: 'sent',
      timestamp: new Date(createdAt + 5000).toISOString(),
    });
  } else {
    status = 'settled';
    statusHistory.push({
      status: 'processing',
      timestamp: new Date(createdAt).toISOString(),
    });
    statusHistory.push({
      status: 'sent',
      timestamp: new Date(createdAt + 5000).toISOString(),
    });
    statusHistory.push({
      status: 'settled',
      timestamp: new Date(createdAt + 10000).toISOString(),
    });
  }

  return {
    transactionId,
    status,
    updatedAt: new Date().toISOString(),
    statusHistory,
    failureReason: shouldFail ? 'Insufficient funds in destination account' : undefined,
  };
};
