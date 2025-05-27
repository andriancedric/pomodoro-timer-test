import { useState, useEffect } from "react";

export interface Note {
  id: string;
  text: string;
  timestamp: string;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pomodoroNotes');
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotes(parsed);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    try {
      localStorage.setItem('pomodoroNotes', JSON.stringify(newNotes));
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  const addNote = (text: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toISOString()
    };
    
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const removeNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const clearNotes = () => {
    setNotes([]);
    try {
      localStorage.removeItem('pomodoroNotes');
    } catch (error) {
      console.error('Failed to clear notes:', error);
    }
  };

  return {
    notes,
    addNote,
    removeNote,
    clearNotes
  };
}
