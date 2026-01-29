import { useState, useEffect, useCallback, useRef } from 'react';
import type { Transaction } from '../types';
import { getTransactionStatus } from '../services/api';

interface UseTransactionStatusReturn {
  status: Transaction | null;
  isPolling: boolean;
  error: Error | null;
  startPolling: (transactionId: string) => void;
  stopPolling: () => void;
}

const POLL_INTERVAL = 3000; // 3 seconds
const MAX_POLL_TIME = 5 * 60 * 1000; // 5 minutes

export const useTransactionStatus = (): UseTransactionStatusReturn => {
  const [status, setStatus] = useState<Transaction | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const transactionIdRef = useRef<string>('');

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const fetchStatus = useCallback(async (transactionId: string) => {
    try {
      const transaction = await getTransactionStatus(transactionId);
      setStatus(transaction);
      setError(null);

      // Stop polling on terminal states
      if (transaction.status === 'settled' || transaction.status === 'failed') {
        stopPolling();
      }

      // Stop polling after max time
      if (Date.now() - startTimeRef.current > MAX_POLL_TIME) {
        stopPolling();
        setError(new Error('Transaction status check timed out. Please contact support.'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transaction status'));
      // Don't stop polling on error, will retry
    }
  }, [stopPolling]);

  const startPolling = useCallback((transactionId: string) => {
    // Stop any existing polling
    stopPolling();

    transactionIdRef.current = transactionId;
    startTimeRef.current = Date.now();
    setIsPolling(true);
    setError(null);

    // Fetch immediately
    fetchStatus(transactionId);

    // Then poll at intervals
    intervalRef.current = setInterval(() => {
      fetchStatus(transactionId);
    }, POLL_INTERVAL);
  }, [fetchStatus, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    status,
    isPolling,
    error,
    startPolling,
    stopPolling,
  };
};
