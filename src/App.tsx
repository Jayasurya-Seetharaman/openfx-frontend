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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">OpenFX</h1>
            <p className="text-gray-600">International Money Transfer</p>
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 flex justify-center items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentScreen === 'quote'
                    ? 'bg-blue-600 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {currentScreen === 'quote' ? '1' : '✓'}
              </div>
              <span className="text-sm font-medium text-gray-700">Get Quote</span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300" />

            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentScreen === 'confirm'
                    ? 'bg-blue-600 text-white'
                    : currentScreen === 'status'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {currentScreen === 'status' ? '✓' : '2'}
              </div>
              <span className="text-sm font-medium text-gray-700">Confirm & Pay</span>
            </div>

            <div className="w-12 h-0.5 bg-gray-300" />

            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  currentScreen === 'status'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                3
              </div>
              <span className="text-sm font-medium text-gray-700">Track Status</span>
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="mt-8">
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
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>© 2026 OpenFX. All rights reserved.</p>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
