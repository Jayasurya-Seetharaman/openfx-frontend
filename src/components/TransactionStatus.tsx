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
        bgClass: 'bg-blue-50',
        borderClass: 'border-blue-200',
        textClass: 'text-blue-900',
        descClass: 'text-blue-700',
        timelineBgClass: 'bg-blue-100',
        timelineBorderClass: 'border-blue-500',
        timelineLineClass: 'bg-blue-200',
      };
    case 'sent':
      return {
        color: 'yellow',
        icon: '✈️',
        title: 'Sent',
        description: 'Payment has been sent to the recipient',
        bgClass: 'bg-yellow-50',
        borderClass: 'border-yellow-200',
        textClass: 'text-yellow-900',
        descClass: 'text-yellow-700',
        timelineBgClass: 'bg-yellow-100',
        timelineBorderClass: 'border-yellow-500',
        timelineLineClass: 'bg-yellow-200',
      };
    case 'settled':
      return {
        color: 'green',
        icon: '✅',
        title: 'Settled',
        description: 'Transaction completed successfully',
        bgClass: 'bg-green-50',
        borderClass: 'border-green-200',
        textClass: 'text-green-900',
        descClass: 'text-green-700',
        timelineBgClass: 'bg-green-100',
        timelineBorderClass: 'border-green-500',
        timelineLineClass: 'bg-green-200',
      };
    case 'failed':
      return {
        color: 'red',
        icon: '❌',
        title: 'Failed',
        description: 'Transaction failed',
        bgClass: 'bg-red-50',
        borderClass: 'border-red-200',
        textClass: 'text-red-900',
        descClass: 'text-red-700',
        timelineBgClass: 'bg-red-100',
        timelineBorderClass: 'border-red-500',
        timelineLineClass: 'bg-red-200',
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
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-7 card-hover">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction Status</h1>

        {/* Transaction ID */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 mb-6 border-2 border-gray-200 shadow-sm">
          <div className="text-sm text-gray-600 mb-1.5 font-medium">Transaction ID</div>
          <div className="font-mono text-sm font-bold text-gray-900 break-all">{transactionId}</div>
        </div>

        {/* Status Display */}
        {status && statusConfig && (
          <div className="space-y-6">
            {/* Current Status Card */}
            <div
              className={`${statusConfig.bgClass} border-2 ${statusConfig.borderClass} rounded-xl p-5 shadow-md ${
                isPolling && !isTerminal ? 'pulse-slow' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{statusConfig.icon}</div>
                <div className="flex-1">
                  <h2 className={`text-xl font-bold ${statusConfig.textClass} mb-2`}>
                    {statusConfig.title}
                  </h2>
                  <p className={`${statusConfig.descClass}`}>{statusConfig.description}</p>
                  {isPolling && !isTerminal && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <LoadingSpinner size="sm" />
                      <span className="font-medium">Checking for updates...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Failure Reason */}
            {status.status === 'failed' && status.failureReason && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-red-900 mb-1.5">Failure Reason</h3>
                <p className="text-red-700 text-sm">{status.failureReason}</p>
              </div>
            )}

            {/* Status Timeline */}
            <div className="border-t-2 border-gray-200 pt-5">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Transaction Timeline</h3>
              <div className="space-y-4">
                {status.statusHistory.map((item, index) => {
                  const itemConfig = getStatusConfig(item.status);
                  const isLast = index === status.statusHistory.length - 1;
                  
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full ${itemConfig.timelineBgClass} border-2 ${itemConfig.timelineBorderClass} flex items-center justify-center text-base shadow-sm`}
                        >
                          {itemConfig.icon}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-8 ${itemConfig.timelineLineClass} my-1.5 rounded-full`} />
                        )}
                      </div>
                      <div className="flex-1 pb-1">
                        <div className="font-bold text-gray-900">{itemConfig.title}</div>
                        <div className="text-sm text-gray-600 mt-0.5">
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
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <span className="text-yellow-600 text-xl mr-3">⚠️</span>
                  <div>
                    <h3 className="font-bold text-yellow-900">Status Check Issue</h3>
                    <p className="text-yellow-700 text-sm mt-1">{error.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t-2 border-gray-200 pt-5">
              {status.status === 'settled' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 text-center shadow-sm">
                    <p className="text-green-800 font-bold">
                      🎉 Your transaction has been completed successfully!
                    </p>
                  </div>
                  <button
                    onClick={onStartOver}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg text-base font-bold hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg btn-primary"
                  >
                    Make Another Transfer
                  </button>
                </div>
              )}

              {status.status === 'failed' && (
                <div className="space-y-3">
                  <button
                    onClick={onStartOver}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg text-base font-bold hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg btn-primary"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => alert('Support contact: support@openfx.com')}
                    className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg text-base font-bold hover:bg-gray-300 shadow-sm hover:shadow-md btn-secondary"
                  >
                    Contact Support
                  </button>
                </div>
              )}

              {(status.status === 'processing' || status.status === 'sent') && (
                <div className="text-center bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-gray-700 font-medium text-sm">Please wait while we process your transaction.</p>
                  <p className="mt-1 text-gray-600 text-sm">This usually takes 10-15 seconds.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {!status && !error && (
          <div className="py-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600 font-medium">Loading transaction status...</p>
          </div>
        )}
      </div>
    </div>
  );
};
