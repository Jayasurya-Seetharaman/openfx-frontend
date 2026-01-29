import { useState } from 'react';
import type { Quote } from './types';
import { QuoteScreen } from './components/QuoteScreen';
import { ConfirmPayScreen } from './components/ConfirmPayScreen';
import { TransactionStatus } from './components/TransactionStatus';
import { ErrorBoundary } from './components/ErrorBoundary';

type Screen = 'quote' | 'confirm' | 'status';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('quote');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const handleQuoteContinue = (quote: Quote) => {
    setSelectedQuote(quote);
    setCurrentScreen('confirm');
  };

  const handlePaymentSuccess = (txId: string) => {
    setTransactionId(txId);
    setCurrentScreen('status');
  };

  const handleBack = () => {
    setCurrentScreen('quote');
  };

  const handleStartOver = () => {
    setSelectedQuote(null);
    setTransactionId(null);
    setCurrentScreen('quote');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4">
        <div className="max-w-4xl mx-auto mb-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">OpenFX</h1>
            <p className="text-sm text-gray-600">Fast, Secure International Money Transfers</p>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-center items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentScreen === 'quote'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-green-500 text-white shadow-md shadow-green-200'
                  }`}
                >
                  {currentScreen === 'quote' ? '1' : '✓'}
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-700 hidden sm:inline">Get Quote</span>
              </div>

              <div className="w-6 md:w-12 h-0.5 bg-gray-200 rounded-full">
                <div className={`h-full bg-gradient-to-r from-blue-600 to-green-500 rounded-full transition-all duration-500 ${
                  currentScreen !== 'quote' ? 'w-full' : 'w-0'
                }`} />
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentScreen === 'confirm'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : currentScreen === 'status'
                      ? 'bg-green-500 text-white shadow-md shadow-green-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentScreen === 'status' ? '✓' : '2'}
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-700 hidden sm:inline">Confirm & Pay</span>
              </div>

              <div className="w-6 md:w-12 h-0.5 bg-gray-200 rounded-full">
                <div className={`h-full bg-gradient-to-r from-blue-600 to-green-500 rounded-full transition-all duration-500 ${
                  currentScreen === 'status' ? 'w-full' : 'w-0'
                }`} />
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    currentScreen === 'status'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  3
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-700 hidden sm:inline">Track Status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="mt-6">
          {currentScreen === 'quote' && <QuoteScreen onContinue={handleQuoteContinue} />}

          {currentScreen === 'confirm' && selectedQuote && (
            <ConfirmPayScreen
              quote={selectedQuote}
              onPaymentSuccess={handlePaymentSuccess}
              onBack={handleBack}
            />
          )}

          {currentScreen === 'status' && transactionId && (
            <TransactionStatus transactionId={transactionId} onStartOver={handleStartOver} />
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-lg shadow-sm px-4 py-2">
            <p className="text-xs text-gray-600">© 2026 OpenFX. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-0.5">Secure • Fast • Reliable</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
