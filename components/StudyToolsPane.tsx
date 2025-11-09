import React from 'react';
import { Chapter } from '../types';
import { Icon } from './common/Icon';
import { Button } from './common/Button';
import { MarkdownRenderer } from './common/MarkdownRenderer';
import { Spinner } from './common/Spinner';

interface StudyToolsPaneProps {
  chapter: Chapter;
  onPlayFlashcards: () => void;
  isGenerating: boolean;
  generationError: string;
}

export const StudyToolsPane: React.FC<StudyToolsPaneProps> = ({ chapter, onPlayFlashcards, isGenerating, generationError }) => {
  if (isGenerating) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-4">
            <Spinner label="Preparing your study session..." size="lg"/>
            <p className="text-sm text-center text-content/70">The AI is analyzing your sources to create a personalized learning experience.</p>
        </div>
    );
  }
  if (generationError) {
      return (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center p-4">
              <Icon icon="xCircle" className="w-12 h-12 text-red-500" />
              <h4 className="font-bold">Failed to Generate Session</h4>
              <p className="text-sm text-content/70">{generationError}</p>
          </div>
      );
  }

  const session = chapter.studySession;
  const disabledButtonStyles = "justify-start disabled:opacity-100 disabled:!text-gray-800 dark:disabled:!text-gray-400";


  return (
    <div className="p-4 space-y-6">
      <div>
        <h4 className="font-bold text-lg flex items-center mb-2"><Icon icon="keyConcepts" className="w-5 h-5 mr-2" /> Key Ideas</h4>
        {session?.isGenerated ? (
          <MarkdownRenderer content={session.keyIdeas} />
        ) : (
          <p className="text-sm text-content/60">{chapter.sources.length > 0 ? 'Add sources to generate key ideas.' : 'Add sources to this chapter to generate key ideas.'}</p>
        )}
      </div>
      <div className="border-t border-base-300 pt-4">
        <h4 className="font-bold text-lg flex items-center mb-3"><Icon icon="sparkles" className="w-5 h-5 mr-2" /> Ready to Practice?</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="ghost"
            className="justify-start"
            onClick={onPlayFlashcards}
            disabled={!session || !session.isGenerated || session.flashcards.length === 0}
            leftIcon={<Icon icon="flashcard" className="w-5 h-5" />}
          >
            Review Flashcards
          </Button>
          <Button
            variant="ghost"
            className={disabledButtonStyles}
            disabled={true}
            leftIcon={<Icon icon="play" className="w-5 h-5" />}
             title="Coming soon!"
          >
            Create Audio Lesson
          </Button>
          <Button
            variant="ghost"
            className={disabledButtonStyles}
            disabled={true}
            leftIcon={<Icon icon="video" className="w-5 h-5" />}
             title="Coming soon!"
          >
            Create Video
          </Button>
           <Button
            variant="ghost"
            className={disabledButtonStyles}
            disabled={true}
            leftIcon={<Icon icon="fillGaps" className="w-5 h-5" />}
             title="Coming soon!"
          >
            Create Fill in the Blanks
          </Button>
        </div>
      </div>
    </div>
  );
};