import { useState, useEffect, useCallback, useRef } from 'react';
import type { Quote, QuoteParams } from '../types';
import { getQuote } from '../services/api';
import { getTimeRemaining } from '../utils/formatters';

interface UseQuoteReturn {
  quote: Quote | null;
  isLoading: boolean;
  error: Error | null;
  isExpired: boolean;
  timeRemaining: number;
  fetchQuote: (params: QuoteParams) => Promise<void>;
  refreshQuote: () => Promise<void>;
}

export const useQuote = (): UseQuoteReturn => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const lastParamsRef = useRef<QuoteParams | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (!quote) {
      setTimeRemaining(0);
      setIsExpired(false);
      return;
    }

    const updateTimer = () => {
      const remaining = getTimeRemaining(quote.expiresAt);
      setTimeRemaining(remaining);
      // Only update isExpired when not loading, so refresh doesn't get overwritten by the old quote's interval
      if (!isLoading) {
        setIsExpired(remaining <= 0);
      }
    };

    // Initial update
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [quote, isLoading]);

  const fetchQuote = useCallback(async (params: QuoteParams) => {
    setIsLoading(true);
    setError(null);
    setIsExpired(false);
    lastParamsRef.current = params;

    try {
      const newQuote = await getQuote(params);
      setQuote(newQuote);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch quote'));
      setQuote(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshQuote = useCallback(async () => {
    if (lastParamsRef.current) {
      await fetchQuote(lastParamsRef.current);
    }
  }, [fetchQuote]);

  return {
    quote,
    isLoading,
    error,
    isExpired,
    timeRemaining,
    fetchQuote,
    refreshQuote,
  };
};
