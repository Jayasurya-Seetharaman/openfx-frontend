import { useEffect } from 'react';
import { useTransactionStatus } from '../hooks/useTransactionStatus';
import { formatTimestamp } from '../utils/formatters';
import { LoadingSpinner } from './LoadingSpinner';
import type { TransactionStatus as TxStatus } from '../types';

interface TransactionStatusProps {
  transactionId: string;
  onStartOver: () => void;
}

const getStatusConfig = (status: TxStatus) => {
  switch (status) {
    case 'processing':
      return {
        color: 'blue',
        icon: '⏳',
        title: 'Processing',
        description: 'Your transaction is being processed',
      };
    case 'sent':
      return {
        color: 'yellow',
        icon: '✈️',
        title: 'Sent',
        description: 'Payment has been sent to the recipient',
      };
    case 'settled':
      return {
        color: 'green',
        icon: '✅',
        title: 'Settled',
        description: 'Transaction completed successfully',
      };
    case 'failed':
      return {
        color: 'red',
        icon: '❌',
        title: 'Failed',
        description: 'Transaction failed',
      };
  }
};

export const TransactionStatus = ({ transactionId, onStartOver }: TransactionStatusProps) => {
  const { status, isPolling, error, startPolling } = useTransactionStatus();

  useEffect(() => {
    startPolling(transactionId);
  }, [transactionId, startPolling]);

  const statusConfig = status ? getStatusConfig(status.status) : null;
  const isTerminal = status?.status === 'settled' || status?.status === 'failed';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Transaction Status</h1>

        {/* Transaction ID */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 mb-1">Transaction ID</div>
          <div className="font-mono text-sm font-semibold text-gray-900">{transactionId}</div>
        </div>

        {/* Status Display */}
        {status && statusConfig && (
          <div className="space-y-6">
            {/* Current Status Card */}
            <div
              className={`bg-${statusConfig.color}-50 border-2 border-${statusConfig.color}-200 rounded-lg p-6`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{statusConfig.icon}</div>
                <div className="flex-1">
                  <h2 className={`text-2xl font-bold text-${statusConfig.color}-900 mb-2`}>
                    {statusConfig.title}
                  </h2>
                  <p className={`text-${statusConfig.color}-700`}>{statusConfig.description}</p>
                  {isPolling && !isTerminal && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <LoadingSpinner size="sm" />
                      <span>Checking for updates...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Failure Reason */}
            {status.status === 'failed' && status.failureReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-1">Reason</h3>
                <p className="text-red-700 text-sm">{status.failureReason}</p>
              </div>
            )}

            {/* Status Timeline */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Transaction Timeline</h3>
              <div className="space-y-4">
                {status.statusHistory.map((item, index) => {
                  const itemConfig = getStatusConfig(item.status);
                  const isLast = index === status.statusHistory.length - 1;
                  
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full bg-${itemConfig.color}-100 border-2 border-${itemConfig.color}-500 flex items-center justify-center text-lg`}
                        >
                          {itemConfig.icon}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-8 bg-${itemConfig.color}-200 my-1`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="font-semibold text-gray-900">{itemConfig.title}</div>
                        <div className="text-sm text-gray-500">
                          {formatTimestamp(item.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-yellow-600 text-xl mr-3">⚠️</span>
                  <div>
                    <h3 className="font-semibold text-yellow-900">Status Check Issue</h3>
                    <p className="text-yellow-700 text-sm mt-1">{error.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t pt-6">
              {status.status === 'settled' && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-semibold">
                      🎉 Your transaction has been completed successfully!
                    </p>
                  </div>
                  <button
                    onClick={onStartOver}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Make Another Transfer
                  </button>
                </div>
              )}

              {status.status === 'failed' && (
                <div className="space-y-3">
                  <button
                    onClick={onStartOver}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => alert('Support contact: support@openfx.com')}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Contact Support
                  </button>
                </div>
              )}

              {(status.status === 'processing' || status.status === 'sent') && (
                <div className="text-center text-sm text-gray-500">
                  <p>Please wait while we process your transaction.</p>
                  <p className="mt-1">This usually takes 10-15 seconds.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {!status && !error && (
          <div className="py-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading transaction status...</p>
          </div>
        )}
      </div>
    </div>
  );
};
