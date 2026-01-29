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
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-7 card-hover">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Confirm & Pay</h1>

        {/* Quote Summary */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 space-y-3 mb-6 border-2 border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Transaction Summary</h2>

          <div className="space-y-2.5">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-700 text-sm font-medium">From Currency</span>
              <span className="font-bold">{quote.sourceCurrency}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-gray-700 text-sm font-medium">To Currency</span>
              <span className="font-bold">{quote.destCurrency}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-gray-700 text-sm font-medium">Exchange Rate</span>
              <span className="font-bold">
                1 {quote.sourceCurrency} = {quote.rate.toFixed(4)} {quote.destCurrency}
              </span>
            </div>

            <div className="border-t-2 border-gray-300 pt-2.5 mt-2">
              <div className="flex justify-between items-center py-1">
                <span className="text-gray-700 text-sm font-medium">Amount</span>
                <span className="font-bold">
                  {formatCurrency(quote.sourceAmount, quote.sourceCurrency)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-gray-700 text-sm font-medium">Fees</span>
              <span className="font-bold">
                {formatCurrency(quote.fees, quote.sourceCurrency)}
              </span>
            </div>

            <div className="border-t-2 border-gray-400 pt-3 mt-2 bg-white rounded-lg p-3 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-bold">Total Payable</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(quote.totalPayable, quote.sourceCurrency)}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-3 mt-2 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-semibold text-sm">Recipient will receive</span>
                <span className="font-bold text-lg text-green-700">
                  {formatCurrency(quote.sourceAmount * quote.rate, quote.destCurrency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Checkbox */}
        <div className="mb-6 bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              disabled={isSubmitting}
              className="mt-0.5 w-5 h-5 text-blue-600 border-gray-400 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-gray-800 font-medium leading-relaxed group-hover:text-gray-900">
              I confirm the transaction details are correct and authorize OpenFX to process this payment.
            </span>
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-start">
              <span className="text-red-600 text-xl mr-3">⚠️</span>
              <div className="flex-1">
                <h3 className="font-bold text-red-900">Payment Failed</h3>
                <p className="text-red-700 mt-1 text-sm">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-base font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md btn-secondary"
          >
            ← Back
          </button>

          <button
            onClick={handlePay}
            disabled={!confirmed || isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg text-base font-bold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg btn-primary"
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
        <div className="mt-5 text-center">
          <div className="inline-block bg-green-50 border-2 border-green-200 rounded-lg px-4 py-2">
            <p className="text-sm text-green-800 font-semibold">🔒 Your payment is secure and encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
};
