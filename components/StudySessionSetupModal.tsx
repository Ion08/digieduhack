
import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Chapter, StudySessionConfig } from '../types';
import { Spinner } from './common/Spinner';

interface StudySessionSetupModalProps {
  chapters: Chapter[];
  onClose: () => void;
  onStart: (config: StudySessionConfig) => void;
}

export const StudySessionSetupModal: React.FC<StudySessionSetupModalProps> = ({ chapters, onClose, onStart }) => {
  const [time, setTime] = useState('1 hour');
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChapterToggle = (chapterId: string) => {
    setSelectedChapterIds(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChapterIds.length === 0) {
      setError('Please select at least one chapter to study.');
      return;
    }
    setError('');
    setIsLoading(true);

    const selectedChapters = chapters.filter(c => selectedChapterIds.includes(c.id));
    // In a real app, you might call the service here.
    // For now, we simulate the delay and pass the config to the parent.
    setTimeout(() => {
        onStart({ time, chapters: selectedChapters });
    }, 1500); // Simulate API call
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl relative">
        {isLoading && (
          <div className="absolute inset-0 bg-base-100/80 dark:bg-base-200/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
            <Spinner label="Generating your personalized plan..." size="lg" />
            <p className="mt-2 text-sm text-content/70">The AI is preparing your session...</p>
          </div>
        )}
        <Button variant="ghost" className="!absolute top-2 right-2" onClick={onClose} aria-label="Close modal">
          <Icon icon="close" />
        </Button>
        <h2 className="text-2xl font-bold mb-6">Setup Your Study Session</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="study-time" className="block text-lg font-semibold text-content mb-2">
              How much time do you have?
            </label>
            <select
              id="study-time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary bg-base-100"
            >
              <option value="30 minutes">30 minutes</option>
              <option value="1 hour">1 hour</option>
              <option value="1.5 hours">1.5 hours</option>
              <option value="2 hours">2 hours</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-semibold text-content mb-2">
              Which chapters do you want to focus on?
            </label>
            <div className="max-h-60 overflow-y-auto space-y-2 p-2 border border-base-300 rounded-md">
              {chapters.map(chapter => (
                <label key={chapter.id} className="flex items-center p-3 bg-base-200/50 rounded-md cursor-pointer hover:bg-base-200">
                  <input
                    type="checkbox"
                    checked={selectedChapterIds.includes(chapter.id)}
                    onChange={() => handleChapterToggle(chapter.id)}
                    className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="ml-3 font-medium text-content">{chapter.title} <span className="text-content/60">({chapter.subject})</span></span>
                </label>
              ))}
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Generate Plan & Start
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
