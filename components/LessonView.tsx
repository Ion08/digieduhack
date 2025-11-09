
import React, { useState, useEffect } from 'react';
import { Chapter, Source, Flashcard, StudySession, TestResult } from '../types';
import { Card } from './common/Card';
import { Icon } from './common/Icon';
import { Button } from './common/Button';
import { ChatPane } from './ChatPane';
import * as geminiService from '../services/geminiService';
import { FlashcardPlayer } from './FlashcardPlayer';
import { AddSourceModal } from './AddSourceModal';
import { TestStepper } from './TestStepper';
import { TestReport } from './TestReport';
import { SourceViewer } from './SourceViewer';
import { StudyToolsPane } from './StudyToolsPane';

interface LessonViewProps {
    chapter: Chapter;
    onBack: () => void;
    onAddSource: (chapterId: string, source: Omit<Source, 'id'>) => void;
    onUpdateChapter: (chapter: Chapter) => void;
}

type SessionPhase = 'generating' | 'learning' | 'testing' | 'report' | 'error';

export const LessonView: React.FC<LessonViewProps> = ({ chapter, onBack, onAddSource, onUpdateChapter }) => {
  const [activeSource, setActiveSource] = useState<Source | null>(chapter.sources[0] || null);
  const [notebookTab, setNotebookTab] = useState<'study' | 'chat'>('study');
  const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
  const [showFlashcardPlayer, setShowFlashcardPlayer] = useState(false);
  
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('generating');
  const [generationError, setGenerationError] = useState('');

  useEffect(() => {
    if (chapter.studySession?.isGenerated) {
        const lastResult = chapter.studySession.resultsHistory?.[chapter.studySession.resultsHistory.length - 1];
        setSessionPhase(lastResult ? 'report' : 'learning');
    } else if (chapter.sources.length > 0) {
        setSessionPhase('generating');
        const allContent = chapter.sources.map(s => `Source: ${s.title}\n${s.content}`).join('\n\n---\n\n');
        const lastResult = chapter.studySession?.resultsHistory?.slice(-1)[0];
        const previousFeedback = lastResult && lastResult.overallScore < 70 ? lastResult.areasForImprovement : undefined;

        geminiService.generateStudySession(allContent, previousFeedback)
            .then(session => {
                onUpdateChapter({ ...chapter, studySession: session });
                setSessionPhase('learning');
            })
            .catch(err => {
                setGenerationError(err.message || 'An unknown error occurred.');
                setSessionPhase('error');
            });
    } else {
        setSessionPhase('learning'); // No sources, just show learning phase (which will be empty)
    }
  }, [chapter.id, chapter.studySession?.isGenerated]);

  const handleTestComplete = (result: TestResult) => {
    const updatedHistory = [...(chapter.studySession?.resultsHistory || []), result];
    onUpdateChapter({ ...chapter, studySession: { ...chapter.studySession!, resultsHistory: updatedHistory }});
    setSessionPhase('report');
  }
  
  const handleRestartSession = () => {
    if(chapter.studySession?.resultsHistory?.slice(-1)[0]?.overallScore < 70) {
        // Regenerate the session to adapt it
        const { studySession, ...chapterWithoutSession } = chapter;
        onUpdateChapter(chapterWithoutSession);
    } else {
        // Just go back to the learning phase
        setSessionPhase('learning');
    }
  }

  const renderContentForPhase = () => {
      switch (sessionPhase) {
          case 'learning':
          case 'generating':
          case 'error':
              return (
                   <StudyToolsPane
                      chapter={chapter}
                      onPlayFlashcards={() => setShowFlashcardPlayer(true)}
                      isGenerating={sessionPhase === 'generating'}
                      generationError={sessionPhase === 'error' ? generationError : ''}
                   />
              );
          case 'report':
              const lastResult = chapter.studySession?.resultsHistory?.slice(-1)[0];
              if (!lastResult) return <p>No report available.</p>
              return <TestReport result={lastResult} onRestart={handleRestartSession} />;
          default:
              return null;
      }
  }

  const TabButton: React.FC<{label: string; view: 'study' | 'chat'}> = ({label, view}) => (
    <button onClick={() => setNotebookTab(view)} className={`px-4 py-2 text-sm font-medium rounded-md ${notebookTab === view ? 'bg-brand-primary/10 text-brand-primary' : 'text-content/60 hover:bg-base-300/50'}`}>
        {label}
    </button>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {showFlashcardPlayer && chapter.studySession && <FlashcardPlayer cards={chapter.studySession.flashcards} onEndSession={() => setShowFlashcardPlayer(false)} onGenerateNew={() => {}} isLoading={false} />}
      {isAddSourceModalOpen && <AddSourceModal onClose={() => setIsAddSourceModalOpen(false)} onAddSource={(source) => onAddSource(chapter.id, source)} />}
      <style>{`.aspect-video { position: relative; width: 100%; padding-top: 56.25%; } .aspect-video iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }`}</style>
      
      <Button variant="ghost" onClick={onBack} className="mb-4">
        &larr; Back to Dashboard
      </Button>
      
      {sessionPhase === 'testing' ? (
        <div className="lg:h-[calc(100vh-12rem)]">
          <Card className="flex flex-col overflow-hidden h-full">
            {chapter.studySession?.exercises && (
              <TestStepper
                exercises={chapter.studySession.exercises}
                sourceContext={chapter.sources.map(s => s.content).join(' ')}
                onTestComplete={handleTestComplete}
                includeAdvancedSteps={true}
              />
            )}
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[calc(100vh-12rem)]">
          {/* Left Pane: Source Viewer */}
          <Card className="flex flex-col overflow-hidden min-h-[400px]">
             <div className="border-b border-base-300 p-4 -m-6 mb-0 bg-base-100 sticky top-0 z-10">
              <h3 className="font-bold text-lg">{chapter.title} - Sources</h3>
              <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-4 -mb-4">
                  {chapter.sources.map(source => (
                      <button key={source.id} onClick={() => setActiveSource(source)} className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap ${activeSource?.id === source.id ? 'bg-brand-secondary text-white' : 'bg-base-200 hover:bg-base-300'}`}>
                         {source.type.toUpperCase()}: {source.title}
                      </button>
                  ))}
                  <button onClick={() => setIsAddSourceModalOpen(true)} className="ml-2 flex-shrink-0 bg-base-200 hover:bg-base-300 rounded-full w-7 h-7 flex items-center justify-center">
                      <Icon icon="plus" className="w-5 h-5 text-content/70"/>
                  </button>
              </div>
            </div>
            <div className={`flex-grow ${activeSource?.type === 'web' && activeSource.url ? 'overflow-hidden' : 'overflow-y-auto'}`}>
              <SourceViewer source={activeSource} />
            </div>
          </Card>

          {/* Right Pane: Notebook */}
          <Card className="flex flex-col overflow-hidden min-h-[400px]">
             <div className="flex items-center gap-2 border-b border-base-300 pb-3">
                <TabButton label="Study Session" view="study" />
                <TabButton label="AI Chat" view="chat" />
              </div>
            <div className="overflow-y-auto flex-grow pt-4">
              {notebookTab === 'study' && renderContentForPhase()}
              {notebookTab === 'chat' && (
                <ChatPane sourceContext={activeSource?.content || "No source material available."} />
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
