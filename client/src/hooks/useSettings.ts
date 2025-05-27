import { useState, useEffect } from "react";

interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

const defaultSettings: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pomodoroSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    try {
      localStorage.setItem('pomodoroSettings', JSON.stringify(defaultSettings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const clearCache = () => {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem('pomodoroSettings');
      localStorage.removeItem('pomodoroNotes');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    clearCache
  };
}
