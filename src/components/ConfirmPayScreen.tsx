import { useState } from 'react';
import type { Quote } from '../types';
import { usePayment } from '../hooks/usePayment';
import { formatCurrency } from '../utils/formatters';
import { LoadingSpinner } from './LoadingSpinner';

interface ConfirmPayScreenProps {
  quote: Quote;
  onPaymentSuccess: (transactionId: string) => void;
  onBack: () => void;
}

export const ConfirmPayScreen = ({ quote, onPaymentSuccess, onBack }: ConfirmPayScreenProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const { isSubmitting, error, submitPayment } = usePayment();

  const handlePay = async () => {
    if (!confirmed || isSubmitting) {
      return;
    }

    const transactionId = await submitPayment(quote.quoteId);
    if (transactionId) {
      onPaymentSuccess(transactionId);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Confirm & Pay</h1>

        {/* Quote Summary */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Transaction Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">From</span>
              <span className="font-semibold">{quote.sourceCurrency}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">To</span>
              <span className="font-semibold">{quote.destCurrency}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Exchange Rate</span>
              <span className="font-semibold">
                1 {quote.sourceCurrency} = {quote.rate.toFixed(4)} {quote.destCurrency}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold">
                  {formatCurrency(quote.sourceAmount, quote.sourceCurrency)}
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Fees</span>
              <span className="font-semibold">
                {formatCurrency(quote.fees, quote.sourceCurrency)}
              </span>
            </div>

            <div className="border-t border-gray-300 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-900 font-bold text-lg">Total Payable</span>
                <span className="text-xl font-bold text-blue-600">
                  {formatCurrency(quote.totalPayable, quote.sourceCurrency)}
                </span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded p-3 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">Recipient will receive</span>
                <span className="font-bold text-green-700">
                  {formatCurrency(quote.sourceAmount * quote.rate, quote.destCurrency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              disabled={isSubmitting}
              className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              I confirm the transaction details are correct and authorize OpenFX to process this payment.
            </span>
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-red-600 text-xl mr-3">⚠️</span>
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Payment Failed</h3>
                <p className="text-red-700 text-sm mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>

          <button
            onClick={handlePay}
            disabled={!confirmed || isSubmitting}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Processing...</span>
              </span>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>🔒 Your payment is secure and encrypted</p>
        </div>
      </div>
    </div>
  );
};
