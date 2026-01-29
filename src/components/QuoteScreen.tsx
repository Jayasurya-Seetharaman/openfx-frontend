import { useState } from 'react';
import type { Quote } from '../types';
import { useQuote } from '../hooks/useQuote';
import { validateAmount } from '../utils/validation';
import { formatCurrency } from '../utils/formatters';
import { CountdownTimer } from './CountdownTimer';
import { LoadingSpinner } from './LoadingSpinner';

interface QuoteScreenProps {
  onContinue: (quote: Quote) => void;
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR'];

export const QuoteScreen = ({ onContinue }: QuoteScreenProps) => {
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [destCurrency, setDestCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState<string | null>(null);

  const { quote, isLoading, error, isExpired, timeRemaining, fetchQuote, refreshQuote } = useQuote();

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value) {
      setAmountError(validateAmount(value));
    } else {
      setAmountError(null);
    }
  };

  const handleGetQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateAmount(amount);
    if (validationError) {
      setAmountError(validationError);
      return;
    }

    await fetchQuote({
      sourceCurrency,
      destCurrency,
      amount: parseFloat(amount),
    });
  };

  const handleContinue = () => {
    if (quote && !isExpired) {
      onContinue(quote);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Get FX Quote</h1>

        <form onSubmit={handleGetQuote} className="space-y-6">
          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount"
              step="0.01"
              min="0"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                amountError ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {amountError && (
              <p className="mt-1 text-sm text-red-600">{amountError}</p>
            )}
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sourceCurrency" className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <select
                id="sourceCurrency"
                value={sourceCurrency}
                onChange={(e) => setSourceCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="destCurrency" className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <select
                id="destCurrency"
                value={destCurrency}
                onChange={(e) => setDestCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Get Quote Button */}
          <button
            type="submit"
            disabled={isLoading || !amount || !!amountError}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Getting Quote...</span>
              </span>
            ) : (
              'Get Quote'
            )}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-red-600 text-xl mr-3">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quote Display */}
        {quote && !error && (
          <div className="mt-6 border-t pt-6">
            <div className="bg-blue-50 rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Your Quote</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Exchange Rate</span>
                  <span className="font-semibold">
                    1 {quote.sourceCurrency} = {quote.rate.toFixed(4)} {quote.destCurrency}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold">
                    {formatCurrency(quote.sourceAmount, quote.sourceCurrency)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Fees</span>
                  <span className="font-semibold">
                    {formatCurrency(quote.fees, quote.sourceCurrency)}
                  </span>
                </div>

                <div className="border-t border-blue-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-900 font-bold">Total Payable</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(quote.totalPayable, quote.sourceCurrency)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">You'll receive approximately</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(quote.sourceAmount * quote.rate, quote.destCurrency)}
                  </span>
                </div>
              </div>

              {/* Timer */}
              <div className="mt-6">
                <CountdownTimer
                  timeRemaining={timeRemaining}
                  totalTime={30}
                  isExpired={isExpired}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                {isExpired ? (
                  <button
                    onClick={refreshQuote}
                    className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    Refresh Quote
                  </button>
                ) : (
                  <button
                    onClick={handleContinue}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
