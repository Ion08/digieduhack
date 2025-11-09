
import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Source, SourceType } from '../types';
import * as geminiService from '../services/geminiService';
import { Spinner } from './common/Spinner';

interface AddSourceModalProps {
  onClose: () => void;
  onAddSource: (source: Omit<Source, 'id'>) => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({ onClose, onAddSource }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<SourceType>('web');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTypeChange = (newType: SourceType) => {
    setType(newType);
    setUrl('');
    setContent('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (type === 'pdf') {
      if (title.trim() && content.trim()) {
        onAddSource({ title, type, content, url: '' });
      } else {
        setError('Title and content are required for this source type.');
      }
    } else {
      if (title.trim() && url.trim()) {
        setIsLoading(true);
        try {
          const { content: generatedContent } = await geminiService.generateContentFromUrl(url, type);
          onAddSource({ title, type, url, content: generatedContent });
          // The parent component will close the modal on success
        } catch (err) {
          setError('Failed to generate content from URL. Please try again.');
          setIsLoading(false);
        }
      } else {
        setError('Title and URL are required for this source type.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg relative">
        {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-lg">
                <Spinner label="Analyzing & summarizing..." size="lg" />
                <p className="mt-2 text-sm text-content/70">The AI is generating your study material.</p>
            </div>
        )}
        <Button variant="ghost" className="!absolute top-2 right-2" onClick={onClose} aria-label="Close modal">
          <Icon icon="close" />
        </Button>
        <h2 className="text-xl font-bold mb-6">Add a New Source</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="source-title" className="block text-sm font-medium text-content/80 mb-1">
              Source Title
            </label>
            <input
              id="source-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary"
              placeholder="e.g., Wikipedia Article on Photosynthesis"
              required
            />
          </div>
          <div>
            <label htmlFor="source-type" className="block text-sm font-medium text-content/80 mb-1">
              Source Type
            </label>
            <select
              id="source-type"
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as SourceType)}
              className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary bg-white"
            >
              <option value="web">Web Page</option>
              <option value="youtube">YouTube Video</option>
              <option value="pdf">PDF / Text</option>
            </select>
          </div>
          
          {(type === 'web' || type === 'youtube') && (
            <div>
              <label htmlFor="source-url" className="block text-sm font-medium text-content/80 mb-1">
                URL
              </label>
              <input
                id="source-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary"
                placeholder="https://..."
                required
              />
            </div>
          )}

          {type === 'pdf' && (
            <div>
              <label htmlFor="source-content" className="block text-sm font-medium text-content/80 mb-1">
                Content
              </label>
              <textarea
                id="source-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary"
                rows={8}
                placeholder={"Paste the article text or relevant content here..."}
                required
              />
            </div>
          )}
          
          <p className="text-xs text-content/60 mt-1">
            {type === 'pdf' 
                ? "The AI will use this text to generate summaries, flashcards, and answer questions."
                : "The AI will analyze the content at the URL to generate study materials."
            }
          </p>
          
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Source
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};