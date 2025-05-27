import { useState, useEffect, useRef, useCallback } from "react";

interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

type TimerState = 'idle' | 'running' | 'paused';
type SessionType = 'work' | 'shortBreak' | 'longBreak';

export function useTimer(settings: Settings) {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [sessionType, setSessionType] = useState<SessionType>('work');
  const [timeRemaining, setTimeRemaining] = useState(settings.workDuration * 60);
  const [sessionCount, setSessionCount] = useState(0);
  const [workSessionsCompleted, setWorkSessionsCompleted] = useState(1);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getSessionDuration = useCallback((type: SessionType) => {
    switch(type) {
      case 'work': return settings.workDuration * 60;
      case 'shortBreak': return settings.shortBreakDuration * 60;
      case 'longBreak': return settings.longBreakDuration * 60;
      default: return settings.workDuration * 60;
    }
  }, [settings]);

  // Update time remaining when settings change and timer is idle
  useEffect(() => {
    if (timerState === 'idle') {
      setTimeRemaining(getSessionDuration(sessionType));
    }
  }, [settings, sessionType, timerState, getSessionDuration]);

  const showNotification = useCallback((message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: message,
        icon: '/favicon.ico'
      });
    }
  }, []);

  const completeSession = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    let nextSessionType: SessionType;
    let newWorkSessionsCompleted = workSessionsCompleted;
    let newSessionCount = sessionCount;
    
    if (sessionType === 'work') {
      newWorkSessionsCompleted++;
      newSessionCount++;
      
      // Determine next session type
      if (newSessionCount % 4 === 0) {
        nextSessionType = 'longBreak';
      } else {
        nextSessionType = 'shortBreak';
      }
      
      setWorkSessionsCompleted(newWorkSessionsCompleted);
      setSessionCount(newSessionCount);
      
      showNotification('Work session completed! Time for a break.');
    } else {
      nextSessionType = 'work';
      showNotification('Break completed! Time to get back to work.');
    }
    
    setSessionType(nextSessionType);
    setTimeRemaining(getSessionDuration(nextSessionType));
    setTimerState('idle');
  }, [sessionType, workSessionsCompleted, sessionCount, getSessionDuration, showNotification]);

  const startTimer = useCallback(() => {
    setTimerState('running');
    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState('paused');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resumeTimer = useCallback(() => {
    startTimer();
  }, [startTimer]);

  const stopTimer = useCallback(() => {
    setTimerState('idle');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimeRemaining(getSessionDuration(sessionType));
  }, [sessionType, getSessionDuration]);

  const resetTimer = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  const skipBreak = useCallback(() => {
    if (sessionType !== 'work') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setSessionType('work');
      setTimeRemaining(getSessionDuration('work'));
      setTimerState('idle');
    }
  }, [sessionType, getSessionDuration]);

  // Check for completion
  useEffect(() => {
    if (timeRemaining === 0 && timerState === 'running') {
      completeSession();
    }
  }, [timeRemaining, timerState, completeSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    timerState,
    sessionType,
    timeRemaining,
    workSessionsCompleted,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    skipBreak
  };
}
