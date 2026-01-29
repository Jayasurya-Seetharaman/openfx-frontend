import { formatTime } from '../utils/formatters';

interface CountdownTimerProps {
  timeRemaining: number;
  totalTime: number;
  isExpired: boolean;
}

export const CountdownTimer = ({ timeRemaining, totalTime, isExpired }: CountdownTimerProps) => {
  const percentage = (timeRemaining / totalTime) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">Quote expires in:</span>
        <span className={`font-mono font-bold ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
          {isExpired ? 'EXPIRED' : formatTime(timeRemaining)}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${
            isExpired
              ? 'bg-red-600'
              : percentage > 50
              ? 'bg-green-500'
              : percentage > 25
              ? 'bg-yellow-500'
              : 'bg-orange-500'
          }`}
          style={{ width: `${Math.max(0, percentage)}%` }}
        />
      </div>
    </div>
  );
};
