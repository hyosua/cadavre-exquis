import React from 'react';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export function Timer({ timeLeft, totalTime }: TimerProps) {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = timeLeft <= 10;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">Temps restant</span>
        <span className={`text-2xl font-bold ${isLow ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
          {timeLeft}s
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isLow ? 'bg-red-600' : 'bg-primary-600'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}