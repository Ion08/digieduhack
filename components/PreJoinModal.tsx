import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { BookedSession, Chapter } from '../types';

interface PreJoinModalProps {
  session: BookedSession;
  chapters: Chapter[];
  onClose: () => void;
}

export const PreJoinModal: React.FC<PreJoinModalProps> = ({ session, chapters, onClose }) => {
  const [selectedChapterIds, setSelectedChapterIds] = useState<string[]>([]);
  const [message, setMessage] = useState('');

  const handleChapterToggle = (chapterId: string) => {
    setSelectedChapterIds(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleSendAndJoin = () => {
    const selectedChapters = chapters.filter(c => selectedChapterIds.includes(c.id));
    // In a real app, this would send the data to a backend.
    alert(`Joining meet. The following will be shared with ${session.teacher.name}:\n\nChapters: ${selectedChapters.map(c => c.title).join(', ') || 'None'}\n\nMessage: ${message || 'No message'}`);
    window.open(session.meetLink, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg relative">
        <Button variant="ghost" className="!absolute top-2 right-2" onClick={onClose} aria-label="Close modal">
          <Icon icon="close" />
        </Button>
        <h2 className="text-xl font-bold mb-1">Share materials with {session.teacher.name}</h2>
        <p className="text-sm text-content/70 mb-6">Select chapters and add a note to help your teacher prepare.</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-content mb-2">
              Chapters to share
            </label>
            <div className="max-h-48 overflow-y-auto space-y-2 p-2 border border-base-300 rounded-md">
              {chapters.map(chapter => (
                <label key={chapter.id} className="flex items-center p-3 bg-base-200/50 rounded-md cursor-pointer hover:bg-base-200">
                  <input
                    type="checkbox"
                    checked={selectedChapterIds.includes(chapter.id)}
                    onChange={() => handleChapterToggle(chapter.id)}
                    className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <span className="ml-3 font-medium text-content">{chapter.title}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="teacher-message" className="block text-base font-semibold text-content mb-2">
              Message (optional)
            </label>
            <textarea
              id="teacher-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary"
              rows={3}
              placeholder={`e.g., "Hi ${session.teacher.name.split(' ')[0]}, I'd like to focus on..."`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendAndJoin} leftIcon={<Icon icon="send" className="w-4 h-4" />}>
            Send & Join Meet
          </Button>
        </div>
      </Card>
    </div>
  );
};