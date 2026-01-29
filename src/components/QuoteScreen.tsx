import { useState } from "react";
import type { Quote } from "../types";
import { useQuote } from "../hooks/useQuote";
import { validateAmount } from "../utils/validation";
import { formatCurrency } from "../utils/formatters";
import { CountdownTimer } from "./CountdownTimer";
import { LoadingSpinner } from "./LoadingSpinner";

interface QuoteScreenProps {
  onContinue: (quote: Quote) => void;
}

const CURRENCIES = ["USD", "EUR", "GBP", "INR"];

export const QuoteScreen = ({ onContinue }: QuoteScreenProps) => {
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [destCurrency, setDestCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);

  const {
    quote,
    isLoading,
    error,
    isExpired,
    timeRemaining,
    fetchQuote,
    refreshQuote,
  } = useQuote();

  const handleSourceCurrencyChange = (newSource: string) => {
    setSourceCurrency(newSource);
    // If the new source matches destination, switch destination to a different currency
    if (newSource === destCurrency) {
      const availableCurrency = CURRENCIES.find((curr) => curr !== newSource);
      if (availableCurrency) {
        setDestCurrency(availableCurrency);
      }
    }
  };

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

    // Prevent same currency exchange
    if (sourceCurrency === destCurrency) {
      setAmountError("From and To currency must be different");
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
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-7 card-hover">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Get FX Quote</h1>

        <form onSubmit={handleGetQuote} className="space-y-5">
          {/* Amount Input */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
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
              className={`w-full px-4 py-3 text-base border-2 rounded-lg input-field focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                amountError
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              disabled={isLoading}
            />
            {amountError && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">
                {amountError}
              </p>
            )}
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="sourceCurrency"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                From Currency
              </label>
              <select
                id="sourceCurrency"
                value={sourceCurrency}
                onChange={(e) => handleSourceCurrencyChange(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg input-field focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 cursor-pointer"
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
              <label
                htmlFor="destCurrency"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                To Currency
              </label>
              <select
                id="destCurrency"
                value={destCurrency}
                onChange={(e) => setDestCurrency(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg input-field focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 cursor-pointer"
                disabled={isLoading}
              >
                {CURRENCIES.filter((curr) => curr !== sourceCurrency).map(
                  (curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>

          {/* Get Quote Button */}
          <button
            type="submit"
            disabled={isLoading || !amount || !!amountError}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg text-base font-bold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg btn-primary"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Getting Quote...</span>
              </span>
            ) : (
              "Get Quote"
            )}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="mt-5 bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <span className="text-red-600 text-xl mr-3">⚠️</span>
              <div>
                <h3 className="font-bold text-red-900">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quote Display */}
        {quote && !error && (
          <div className="mt-6 border-t-2 border-gray-200 pt-5">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 space-y-4 shadow-md border border-blue-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Your Quote
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-700 text-sm font-medium">
                    Exchange Rate
                  </span>
                  <span className="font-bold">
                    1 {quote.sourceCurrency} = {quote.rate.toFixed(4)}{" "}
                    {quote.destCurrency}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-700 text-sm font-medium">
                    Amount
                  </span>
                  <span className="font-bold">
                    {formatCurrency(quote.sourceAmount, quote.sourceCurrency)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-700 text-sm font-medium">
                    Fees
                  </span>
                  <span className="font-bold">
                    {formatCurrency(quote.fees, quote.sourceCurrency)}
                  </span>
                </div>

                <div className="border-t-2 border-blue-200 pt-3 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold">
                      Total Payable
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(quote.totalPayable, quote.sourceCurrency)}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-sm font-medium">
                      Recipient receives
                    </span>
                    <span className="font-bold text-lg text-green-700">
                      {formatCurrency(
                        quote.sourceAmount * quote.rate,
                        quote.destCurrency,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="mt-5">
                <CountdownTimer
                  timeRemaining={timeRemaining}
                  totalTime={30}
                  isExpired={isExpired}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-5">
                {isExpired ? (
                  <button
                    onClick={refreshQuote}
                    className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-6 rounded-lg text-base font-bold hover:from-orange-700 hover:to-orange-800 shadow-md hover:shadow-lg btn-primary"
                  >
                    Refresh Quote
                  </button>
                ) : (
                  <button
                    onClick={handleContinue}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-lg text-base font-bold hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg btn-primary"
                  >
                    Continue to Payment →
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
