import { Play, Square, Pause, RotateCcw, FastForward } from "lucide-react";

interface TimerControlsProps {
  timerState: 'idle' | 'running' | 'paused';
  sessionType: 'work' | 'shortBreak' | 'longBreak';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
  onSkipBreak: () => void;
}

export default function TimerControls({
  timerState,
  sessionType,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
  onSkipBreak
}: TimerControlsProps) {
  if (timerState === 'idle') {
    return (
      <div className="flex justify-center">
        <button 
          onClick={onStart}
          className="btn-primary px-12 py-4 rounded-lg text-lg"
        >
          <Play className="w-5 h-5 mr-2 inline" />
          Start
        </button>
      </div>
    );
  }

  if (timerState === 'running') {
    return (
      <div className="flex justify-center gap-4">
        <button 
          onClick={onStop}
          className="btn-danger px-6 py-3 rounded-lg"
        >
          <Square className="w-4 h-4 mr-2 inline" />
          Stop
        </button>
        <button 
          onClick={onPause}
          className="btn-warning px-6 py-3 rounded-lg"
        >
          <Pause className="w-4 h-4 mr-2 inline" />
          Pause
        </button>
        <button 
          onClick={onReset}
          className="btn-secondary px-6 py-3 rounded-lg"
        >
          <RotateCcw className="w-4 h-4 mr-2 inline" />
          Reset
        </button>
      </div>
    );
  }

  if (timerState === 'paused') {
    return (
      <div className="flex justify-center gap-4">
        <button 
          onClick={onStop}
          className="btn-danger px-6 py-3 rounded-lg"
        >
          <Square className="w-4 h-4 mr-2 inline" />
          Stop
        </button>
        <button 
          onClick={onResume}
          className="btn-primary px-6 py-3 rounded-lg"
        >
          <Play className="w-4 h-4 mr-2 inline" />
          Resume
        </button>
        <button 
          onClick={onReset}
          className="btn-secondary px-6 py-3 rounded-lg"
        >
          <RotateCcw className="w-4 h-4 mr-2 inline" />
          Reset
        </button>
      </div>
    );
  }

  return null;
}
