
import React, { useState } from 'react';
import { Card } from './common/Card';
import { Student, Chapter, StudySessionConfig } from '../types';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { AddChapterModal } from './AddChapterModal';
import { MarkdownRenderer } from './common/MarkdownRenderer';
import { StudySessionSetupModal } from './StudySessionSetupModal';

interface StudentDashboardProps {
  student: Student;
  chapters: Chapter[];
  onSelectChapter: (chapter: Chapter) => void;
  onAddChapter: (title: string, subject: string) => void;
  personalizedPlan?: string;
  onStartStudySession: (config: StudySessionConfig) => void;
}

const StudySessionPrompt: React.FC<{ onStart: () => void }> = ({ onStart }) => (
    <Card className="mb-6 bg-brand-primary/5 border-2 border-brand-primary/20">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <Icon icon="sparkles" className="w-12 h-12 text-brand-primary flex-shrink-0" />
            <div>
                <h3 className="text-xl font-bold text-content mb-1">Supercharge Your Learning!</h3>
                <p className="text-content/80">Start a guided study session to create a personalized plan, take focused tests, and reflect on your progress with AI.</p>
            </div>
            <Button onClick={onStart} className="w-full sm:w-auto sm:ml-auto mt-4 sm:mt-0 flex-shrink-0">
                Start Guided Session
            </Button>
        </div>
    </Card>
);

const ChapterCard: React.FC<{ chapter: Chapter; onSelect: () => void }> = ({ chapter, onSelect }) => (
    <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
        <div>
            <p className="text-sm font-semibold text-brand-primary">{chapter.subject}</p>
            <h3 className="text-lg font-bold text-content mt-1 mb-3">{chapter.title}</h3>
        </div>
        <div>
            <div className="w-full bg-base-200 rounded-full h-2.5 mb-2">
                <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${chapter.progress}%` }}></div>
            </div>
            <p className="text-xs text-content/70 mb-4">{chapter.progress}% complete</p>
            <Button onClick={onSelect} className="w-full">
                Study Chapter
            </Button>
        </div>
    </Card>
);

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ student, chapters, onSelectChapter, onAddChapter, personalizedPlan, onStartStudySession }) => {
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);
  const [isStudySessionModalOpen, setIsStudySessionModalOpen] = useState(false);
  const [showPlan, setShowPlan] = useState(!!personalizedPlan);

  const handleStartSession = (config: StudySessionConfig) => {
    setIsStudySessionModalOpen(false);
    onStartStudySession(config);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {isAddChapterModalOpen && (
        <AddChapterModal 
            onClose={() => setIsAddChapterModalOpen(false)}
            onAddChapter={(title, subject) => {
                onAddChapter(title, subject);
                setIsAddChapterModalOpen(false);
            }}
        />
      )}
      {isStudySessionModalOpen && (
          <StudySessionSetupModal
            chapters={chapters}
            onClose={() => setIsStudySessionModalOpen(false)}
            onStart={handleStartSession}
          />
      )}
      
      {showPlan && personalizedPlan && (
        <Card className="mb-6 relative bg-brand-primary/5 border-2 border-brand-primary/20">
            <Button variant="ghost" className="!absolute top-2 right-2 !p-1 h-auto" onClick={() => setShowPlan(false)}>
              <Icon icon="close" className="w-5 h-5" />
            </Button>
            <div className="flex items-start gap-4">
                <Icon icon="sparkles" className="w-8 h-8 text-brand-primary mt-1 flex-shrink-0" />
                <div>
                    <h3 className="text-xl font-bold text-content mb-2">Your Personalized Plan!</h3>
                    <MarkdownRenderer content={personalizedPlan} />
                </div>
            </div>
        </Card>
      )}

      <StudySessionPrompt onStart={() => setIsStudySessionModalOpen(true)} />
      
      <h2 className="text-3xl font-bold text-content mb-6">Welcome back, {student.name}!</h2>
      
      <div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
            <h3 className="text-2xl font-bold text-content">Your Chapters</h3>
            <Button onClick={() => setIsAddChapterModalOpen(true)} leftIcon={<Icon icon="plus" className="w-5 h-5"/>}>
                New Chapter
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map(chapter => <ChapterCard key={chapter.id} chapter={chapter} onSelect={() => onSelectChapter(chapter)} />)}
          </div>
      </div>

    </div>
  );
};
