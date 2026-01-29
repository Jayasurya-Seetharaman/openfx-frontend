import { useState, useCallback } from 'react';
import { submitPayment } from '../services/api';

interface UsePaymentReturn {
  transactionId: string | null;
  isSubmitting: boolean;
  error: Error | null;
  submitPayment: (quoteId: string) => Promise<string | null>;
}

export const usePayment = (): UsePaymentReturn => {
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submit = useCallback(async (quoteId: string): Promise<string | null> => {
    // Prevent double submission
    if (isSubmitting) {
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitPayment(quoteId);
      setTransactionId(response.transactionId);
      return response.transactionId;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment failed');
      setError(error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  return {
    transactionId,
    isSubmitting,
    error,
    submitPayment: submit,
  };
};
