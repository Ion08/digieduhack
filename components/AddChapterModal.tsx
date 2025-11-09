
import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';

interface AddChapterModalProps {
  onClose: () => void;
  onAddChapter: (title: string, subject: string) => void;
}

export const AddChapterModal: React.FC<AddChapterModalProps> = ({ onClose, onAddChapter }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && subject.trim()) {
      onAddChapter(title, subject);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg relative">
        <Button variant="ghost" className="!absolute top-2 right-2" onClick={onClose} aria-label="Close modal">
          <Icon icon="close" />
        </Button>
        <h2 className="text-xl font-bold mb-6">Create a New Chapter</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="chapter-title" className="block text-sm font-medium text-content/80 mb-1">
              Chapter Title
            </label>
            <input
              id="chapter-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary"
              placeholder="e.g., The French Revolution"
              required
            />
          </div>
          <div>
            <label htmlFor="chapter-subject" className="block text-sm font-medium text-content/80 mb-1">
              Subject
            </label>
            <input
              id="chapter-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary"
              placeholder="e.g., History"
              required
            />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Chapter
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
