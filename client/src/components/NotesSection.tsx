import { useState } from "react";
import { Plus, X, FastForward } from "lucide-react";

interface Note {
  id: string;
  text: string;
  timestamp: string;
}

interface NotesSectionProps {
  notes: Note[];
  workSessionsCompleted: number;
  sessionType: 'work' | 'shortBreak' | 'longBreak';
  timerState: 'idle' | 'running' | 'paused';
  onAddNote: (text: string) => void;
  onRemoveNote: (id: string) => void;
  onSkipBreak: () => void;
}

export default function NotesSection({
  notes,
  workSessionsCompleted,
  sessionType,
  timerState,
  onAddNote,
  onRemoveNote,
  onSkipBreak
}: NotesSectionProps) {
  const [noteText, setNoteText] = useState("");

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText.trim());
      setNoteText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddNote();
    }
  };

  const showSkipBreak = sessionType !== 'work' && timerState === 'running';

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold text-white mb-4 text-center">Notes</h3>
      
      {/* Notes List */}
      <div className="mb-4 space-y-2 max-h-40 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-gray-400 text-center py-4 text-sm">
            No notes yet. Add one below!
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="glass-card p-3 text-white fade-in">
              <div className="flex justify-between items-start">
                <span className="flex-1 pr-2">{note.text}</span>
                <button 
                  onClick={() => onRemoveNote(note.id)}
                  className="text-red-400 hover:text-red-300 transition-colors duration-200 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Note Input */}
      <div className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add new notes here"
          className="flex-1 glass-input"
        />
        <button 
          onClick={handleAddNote}
          className="bg-[hsl(var(--timer-blue))] hover:bg-blue-500 text-white px-4 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Session Progress & Skip Break */}
      <div className="flex justify-between items-center text-sm text-gray-300">
        <span>{workSessionsCompleted} of 4 works done</span>
        {showSkipBreak && (
          <button 
            onClick={onSkipBreak}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            <FastForward className="w-3 h-3 mr-1 inline" />
            Skip Break
          </button>
        )}
      </div>
    </div>
  );
}
