import { useState, useEffect } from "react";
import { X, Save, RotateCcw, Trash2 } from "lucide-react";

interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

interface SettingsPanelProps {
  isOpen: boolean;
  settings: Settings;
  onClose: () => void;
  onSave: (settings: Settings) => void;
  onReset: () => void;
  onClearCache: () => void;
}

export default function SettingsPanel({
  isOpen,
  settings,
  onClose,
  onSave,
  onReset,
  onClearCache
}: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const [saveButtonText, setSaveButtonText] = useState("Save Changes");

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(localSettings);
    setSaveButtonText("Saved!");
    setTimeout(() => setSaveButtonText("Save Changes"), 1500);
  };

  const handleReset = () => {
    const defaultSettings = {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15
    };
    setLocalSettings(defaultSettings);
  };

  const updateSetting = (key: keyof Settings, value: number) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div 
      className={`fixed top-0 right-0 h-full w-80 settings-panel transform transition-transform duration-300 ease-out shadow-2xl z-50 ${
        isOpen ? 'translate-x-0 slide-in-right' : 'translate-x-full'
      }`}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Settings Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="text-red-400 hover:text-red-300 text-xl transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Settings Form */}
        <div className="space-y-6 flex-1">
          {/* Work Duration */}
          <div>
            <label className="block text-white font-medium mb-2">Work Duration</label>
            <div className="relative">
              <input 
                type="number" 
                value={localSettings.workDuration} 
                onChange={(e) => updateSetting('workDuration', parseInt(e.target.value) || 25)}
                min="1" 
                max="60"
                className="w-full glass-input pr-16"
              />
              <span className="absolute right-3 top-3 text-gray-400 text-sm">mins.</span>
            </div>
          </div>

          {/* Short Break Duration */}
          <div>
            <label className="block text-white font-medium mb-2">Short Break</label>
            <div className="relative">
              <input 
                type="number" 
                value={localSettings.shortBreakDuration} 
                onChange={(e) => updateSetting('shortBreakDuration', parseInt(e.target.value) || 5)}
                min="1" 
                max="30"
                className="w-full glass-input pr-16"
              />
              <span className="absolute right-3 top-3 text-gray-400 text-sm">mins.</span>
            </div>
          </div>

          {/* Long Break Duration */}
          <div>
            <label className="block text-white font-medium mb-2">Long Break</label>
            <div className="relative">
              <input 
                type="number" 
                value={localSettings.longBreakDuration} 
                onChange={(e) => updateSetting('longBreakDuration', parseInt(e.target.value) || 15)}
                min="1" 
                max="60"
                className="w-full glass-input pr-16"
              />
              <span className="absolute right-3 top-3 text-gray-400 text-sm">mins.</span>
            </div>
          </div>
        </div>

        {/* Settings Actions */}
        <div className="space-y-3 mt-8">
          <button 
            onClick={handleSave}
            className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
              saveButtonText === "Saved!" 
                ? "bg-green-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <Save className="w-4 h-4 mr-2 inline" />
            {saveButtonText}
          </button>
          <button 
            onClick={handleReset}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-4 h-4 mr-2 inline" />
            Reset All Changes
          </button>
          <button 
            onClick={onClearCache}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Trash2 className="w-4 h-4 mr-2 inline" />
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
}
