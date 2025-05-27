import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import Timer from "@/components/Timer";
import TimerControls from "@/components/TimerControls";
import NotesSection from "@/components/NotesSection";
import SettingsPanel from "@/components/SettingsPanel";
import { useTimer } from "@/hooks/useTimer";
import { useSettings } from "@/hooks/useSettings";
import { useNotes } from "@/hooks/useNotes";

export default function PomodoroPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, updateSettings, resetSettings, clearCache } = useSettings();
  const { notes, addNote, removeNote } = useNotes();
  const {
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
  } = useTimer(settings);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch(e.key) {
        case ' ':
          e.preventDefault();
          if (timerState === 'idle') startTimer();
          else if (timerState === 'running') pauseTimer();
          else if (timerState === 'paused') resumeTimer();
          break;
        case 'r':
          if (timerState !== 'idle') resetTimer();
          break;
        case 's':
          if (timerState === 'running') stopTimer();
          break;
        case 'Escape':
          if (isSettingsOpen) setIsSettingsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [timerState, isSettingsOpen, startTimer, pauseTimer, resumeTimer, resetTimer, stopTimer]);

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  const handleSaveSettings = (newSettings: typeof settings) => {
    updateSettings(newSettings);
    setIsSettingsOpen(false);
  };

  const handleClearCache = () => {
    if (confirm('Are you sure you want to clear all data? This will reset your settings and delete all notes.')) {
      clearCache();
      setIsSettingsOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center p-6 relative z-10">
        <h1 className="text-xl font-semibold text-white">Pomodoro Timer</h1>
        <button 
          onClick={toggleSettings}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 backdrop-blur-sm"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Options</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Timer Display */}
        <div className="mb-12">
          <Timer
            timeRemaining={timeRemaining}
            sessionType={sessionType}
            timerState={timerState}
            settings={settings}
          />
        </div>

        {/* Timer Controls */}
        <div className="mb-12">
          <TimerControls
            timerState={timerState}
            sessionType={sessionType}
            onStart={startTimer}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onStop={stopTimer}
            onReset={resetTimer}
            onSkipBreak={skipBreak}
          />
        </div>

        {/* Notes Section */}
        <div className="w-full max-w-md">
          <NotesSection
            notes={notes}
            workSessionsCompleted={workSessionsCompleted}
            sessionType={sessionType}
            timerState={timerState}
            onAddNote={addNote}
            onRemoveNote={removeNote}
            onSkipBreak={skipBreak}
          />
        </div>
      </main>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        settings={settings}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        onReset={() => resetSettings()}
        onClearCache={handleClearCache}
      />

      {/* Settings Overlay */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
