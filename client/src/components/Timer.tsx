import { useMemo } from "react";

interface TimerProps {
  timeRemaining: number;
  sessionType: 'work' | 'shortBreak' | 'longBreak';
  timerState: 'idle' | 'running' | 'paused';
  settings: {
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
  };
}

export default function Timer({ timeRemaining, sessionType, timerState, settings }: TimerProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSessionLabel = (type: string) => {
    switch(type) {
      case 'work': return 'Work Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Work Session';
    }
  };

  const getSessionDuration = (type: string) => {
    switch(type) {
      case 'work': return settings.workDuration * 60;
      case 'shortBreak': return settings.shortBreakDuration * 60;
      case 'longBreak': return settings.longBreakDuration * 60;
      default: return 1500;
    }
  };

  const progress = useMemo(() => {
    const totalDuration = getSessionDuration(sessionType);
    return (totalDuration - timeRemaining) / totalDuration;
  }, [timeRemaining, sessionType, settings]);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (progress * circumference);

  return (
    <div className="relative">
      <div className="relative w-80 h-80">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="rgba(96, 165, 250, 0.2)" 
            strokeWidth="2" 
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="#60A5FA" 
            strokeWidth="3" 
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="timer-circle"
          />
        </svg>
        
        {/* Timer Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-7xl font-bold text-white mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-lg text-gray-300 font-medium">
              {getSessionLabel(sessionType)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
