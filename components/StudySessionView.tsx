import React, { useState, useEffect } from 'react';
import { ActiveStudySession, Chapter, TestResult, View, ChatMessage, Source, TrueFalseQuestion, FillTheGapsExercise, DefinitionTerm } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { MarkdownRenderer } from './common/MarkdownRenderer';
import { TestStepper } from './TestStepper';
import { TestReport } from './TestReport';
import { AIReflectionModal } from './AIReflectionModal';
import * as geminiService from '../services/geminiService';
import { Spinner } from './common/Spinner';
import { SourceViewer } from './SourceViewer';
import { ChatPane } from './ChatPane';
import { AddSourceModal } from './AddSourceModal';
import { FlashcardPlayer } from './FlashcardPlayer';
import { StudyToolsPane } from './StudyToolsPane';

interface StudySessionViewProps {
  session: ActiveStudySession;
  onUpdateSession: (update: Partial<ActiveStudySession>) => void;
  onEndSession: () => void;
  setView: (view: View) => void;
  onAddSource: (chapterId: string, source: Omit<Source, 'id'>) => void;
  onUpdateChapter: (chapter: Chapter) => void;
}

// Fisher-Yates shuffle utility
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const Stepper: React.FC<{ currentStep: number; steps: { name: string; icon: React.ComponentProps<typeof Icon>['icon'] }[] }> = ({ currentStep, steps }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={`${step.name}-${stepIdx}`} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-12' : ''} flex-shrink-0`}>
            {stepIdx < currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-brand-primary"></div>
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary">
                  <Icon icon={step.icon} className="h-5 w-5 text-white" />
                </div>
              </>
            ) : stepIdx === currentStep ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-base-300"></div>
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-primary bg-base-100">
                  <Icon icon={step.icon} className="h-5 w-5 text-brand-primary" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-base-300"></div>
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-base-300 bg-base-100">
                   <Icon icon={step.icon} className="h-5 w-5 text-content/40" />
                </div>
              </>
            )}
             <span style={{lineHeight: 1.2, maxWidth: '6rem'}} className="absolute top-10 left-1/2 -translate-x-1/2 w-24 text-center text-xs font-semibold text-content/80 leading-tight">{step.name}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
};


const BreakView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Card className="text-center flex flex-col items-center justify-center min-h-[50vh]">
      <Icon icon="clock" className="w-16 h-16 text-brand-primary mx-auto mb-4" />
      <h3 className="text-2xl font-bold mb-2">Time for a Quick Break!</h3>
      <p className="text-content/80 max-w-md mx-auto mb-6">
        Rest your eyes and stretch a bit. The next chapter will start automatically.
      </p>
      <div className="text-6xl font-bold font-mono text-content my-4">
        {formatTime(timeLeft)}
      </div>
      <Button onClick={onComplete} size="md" variant="secondary">
        Skip Break & Start Next Chapter
      </Button>
    </Card>
  );
};


export const StudySessionView: React.FC<StudySessionViewProps> = ({ session, onUpdateSession, onEndSession, setView, onAddSource, onUpdateChapter }) => {
    const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
    
    // Chapter-specific study states
    const [studyMode, setStudyMode] = useState<'plan' | 'chapter'>('plan');
    const [allChaptersStudied, setAllChaptersStudied] = useState(false);
    const [activeSource, setActiveSource] = useState<Source | null>(null);
    const [notebookTab, setNotebookTab] = useState<'ideas' | 'chat'>('ideas');
    const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
    const [showFlashcardPlayer, setShowFlashcardPlayer] = useState(false);
    const [isGeneratingChapter, setIsGeneratingChapter] = useState(false);
    const [generationError, setGenerationError] = useState('');
    
    const currentChapter = session.config.chapters[session.currentChapterIndex];

    useEffect(() => {
        setActiveSource(currentChapter?.sources[0] || null);
        setStudyMode('plan'); // Return to plan view when chapter changes
    }, [currentChapter]);

    const handleEnterChapterStudy = () => {
        setStudyMode('chapter');
        // If chapter study materials don't exist, generate them now.
        if (!currentChapter.studySession?.isGenerated && currentChapter.sources.length > 0) {
            setIsGeneratingChapter(true);
            setGenerationError('');
            const allContent = currentChapter.sources.map(s => `Source: ${s.title}\n${s.content}`).join('\n\n---\n\n');
            geminiService.generateStudySession(allContent)
                .then(sessionData => {
                    onUpdateChapter({ ...currentChapter, studySession: sessionData });
                })
                .catch(err => {
                    console.error("Failed to generate chapter session:", err);
                    setGenerationError(err.message || 'An unknown error occurred.');
                })
                .finally(() => setIsGeneratingChapter(false));
        }
    };

    const handleFinishChapter = () => {
        onUpdateSession({ phase: 'chapter_testing' });
    };

    const handleBreakComplete = () => {
        onUpdateSession({
            phase: 'studying',
            currentChapterIndex: session.currentChapterIndex + 1,
        });
    };

    const handleChapterTestComplete = (result: TestResult) => {
        onUpdateSession({ chapterTestResult: result, phase: 'chapter_report' });
    };
    
    const handleContinueAfterChapterReport = () => {
        if (session.currentChapterIndex < session.config.chapters.length - 1) {
            onUpdateSession({ phase: 'break' });
        } else {
            setAllChaptersStudied(true);
            onUpdateSession({ phase: 'reflecting' });
        }
    };
    
    const handleReflectionComplete = async (history: ChatMessage[]) => {
      const assessment = await geminiService.generateFinalAssessment(history);
      onUpdateSession({
        reflectionHistory: history,
        finalAssessment: assessment,
        phase: 'complete',
      });
      setIsReflectionModalOpen(false);
    };

    const dynamicSteps = [
        ...session.config.chapters.map(chapter => ({ name: chapter.title, icon: 'book' as const })),
        { name: 'Reflect', icon: 'chat' as const },
        { name: 'Complete', icon: 'checkCircle' as const },
    ];

    const numChapters = session.config.chapters.length;
    const getStepIndex = () => {
        switch (session.phase) {
        case 'studying':
        case 'break':
        case 'chapter_testing':
        case 'chapter_report':
            return session.currentChapterIndex;
        case 'reflecting': 
            return numChapters;
        case 'complete': 
            return numChapters + 1;
        default: 
            return session.currentChapterIndex;
        }
    };
    const currentStepIndex = getStepIndex();
    
    const renderStudyPhase = () => {
        if (studyMode === 'plan') {
          return (
            <div className="space-y-6">
              <Card>
                <h3 className="text-xl font-bold mb-2">Your Study Plan</h3>
                <MarkdownRenderer content={session.plan} />
              </Card>
              
              {!allChaptersStudied ? (
                  <Card className="text-center">
                    <p className="text-sm text-content/70">Next Up</p>
                    <h3 className="text-2xl font-bold my-2">{currentChapter.title}</h3>
                    <p className="font-semibold text-brand-primary">{currentChapter.subject}</p>
                    <div className="mt-6">
                      <Button onClick={handleEnterChapterStudy} leftIcon={<Icon icon="book" className="w-5 h-5"/>}>
                        Start Studying Chapter
                      </Button>
                    </div>
                  </Card>
              ) : (
                 <Card className="text-center bg-brand-secondary/10 border-brand-secondary/20">
                    <Icon icon="checkCircle" className="w-12 h-12 text-brand-secondary mx-auto mb-2" />
                    <h3 className="text-xl font-bold">You've studied all your chapters!</h3>
                    <p className="text-content/80 mt-2 mb-6">Great job focusing. Now, let's reflect on what you've learned.</p>
                    <Button variant="secondary" onClick={() => onUpdateSession({ phase: 'reflecting' })}>
                      Start Reflection
                    </Button>
                 </Card>
              )}
            </div>
          );
        }

        if (studyMode === 'chapter') {
          return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[calc(100vh-25rem)]">
                  {/* Left Pane: Source Viewer */}
                  <Card className="flex flex-col overflow-hidden min-h-[400px]">
                    <div className="border-b border-base-300 p-4 -m-6 mb-0 bg-base-100 sticky top-0 z-10">
                      <h3 className="font-bold text-lg">{currentChapter.title} - Sources</h3>
                      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-4 -mb-4">
                          {currentChapter.sources.map(source => (
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
                        <button onClick={() => setNotebookTab('ideas')} className={`px-4 py-2 text-sm font-medium rounded-md ${notebookTab === 'ideas' ? 'bg-brand-primary/10 text-brand-primary' : 'text-content/60 hover:bg-base-300/50'}`}>Study Tools</button>
                        <button onClick={() => setNotebookTab('chat')} className={`px-4 py-2 text-sm font-medium rounded-md ${notebookTab === 'chat' ? 'bg-brand-primary/10 text-brand-primary' : 'text-content/60 hover:bg-base-300/50'}`}>AI Chat</button>
                      </div>
                    <div className="overflow-y-auto flex-grow pt-4">
                      {notebookTab === 'ideas' && (
                          <StudyToolsPane
                            chapter={currentChapter}
                            onPlayFlashcards={() => setShowFlashcardPlayer(true)}
                            isGenerating={isGeneratingChapter}
                            generationError={generationError}
                          />
                      )}
                      {notebookTab === 'chat' && (
                        <ChatPane sourceContext={activeSource?.content || "No source material available."} />
                      )}
                    </div>
                  </Card>
                </div>
                 <Card className="flex justify-between items-center">
                    <Button variant="ghost" onClick={() => setStudyMode('plan')}>
                    &larr; Back to Main Plan
                    </Button>
                    <Button variant="secondary" onClick={handleFinishChapter} disabled={!currentChapter.studySession?.isGenerated}>
                       Take Chapter Quiz
                    </Button>
                </Card>
            </div>
          );
        }
    };

    const renderContent = () => {
        switch (session.phase) {
            case 'studying':
                return renderStudyPhase();
            case 'break':
                return <BreakView onComplete={handleBreakComplete} />;
            case 'chapter_testing':
                 if (!currentChapter.studySession?.exercises) {
                    return (
                        <Card className="text-center">
                            <h3 className="text-xl font-bold text-red-500 mb-2">Cannot Start Quiz</h3>
                            <p className="text-content/80">No practice exercises were generated for this chapter. Please add sources to generate a quiz.</p>
                             <Button onClick={() => onUpdateSession({ phase: 'studying' })} className="mt-4">Back to Study</Button>
                        </Card>
                    );
                }
                return <Card className="h-[calc(100vh-18rem)] overflow-hidden flex flex-col"><TestStepper exercises={currentChapter.studySession.exercises} sourceContext={currentChapter.sources.map(s => s.content).join('\n')} onTestComplete={handleChapterTestComplete} includeAdvancedSteps={false} /></Card>;
            case 'chapter_report':
                if (!session.chapterTestResult) return <p>Loading report...</p>;
                return <TestReport result={session.chapterTestResult} onRestart={handleContinueAfterChapterReport} continueButtonText="Continue" />
            case 'reflecting':
                 return (
                    <Card className="text-center">
                        <h3 className="text-2xl font-bold mb-2">Final Step: Reflect & Solidify</h3>
                        <p className="text-content/80 max-w-2xl mx-auto mb-6">Connect with a teacher for human feedback, or use our AI coach to reflect on what you've learned and lock in your knowledge.</p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Button variant="secondary" onClick={() => setView(View.TEACHERS)} leftIcon={<Icon icon="users" />}>
                                Book a Teacher
                            </Button>
                             <Button onClick={() => setIsReflectionModalOpen(true)} leftIcon={<Icon icon="chat" />}>
                                Start AI Reflection
                            </Button>
                             <Button variant="ghost" onClick={() => onUpdateSession({ phase: 'complete' })}>
                                Complete Session
                            </Button>
                        </div>
                    </Card>
                 );
            case 'complete':
                return (
                    <Card className="text-center">
                        <Icon icon="academic-cap" className="w-16 h-16 text-brand-secondary mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Study Session Complete!</h3>
                        <div className="my-4 p-4 bg-base-200 rounded-md">
                            <p className="font-semibold text-lg">Final AI Assessment:</p>
                            <p className="text-content/90">{session.finalAssessment || 'You have successfully completed the session. Well done!'}</p>
                        </div>
                        <Button onClick={onEndSession} size="md">Back to Dashboard</Button>
                    </Card>
                )

        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Modals */}
            {isReflectionModalOpen && (
                <AIReflectionModal
                    onClose={() => setIsReflectionModalOpen(false)}
                    onComplete={handleReflectionComplete}
                />
            )}
            {isAddSourceModalOpen && <AddSourceModal onClose={() => setIsAddSourceModalOpen(false)} onAddSource={(source) => onAddSource(currentChapter.id, source)} />}
            {showFlashcardPlayer && currentChapter.studySession && <FlashcardPlayer cards={currentChapter.studySession.flashcards} onEndSession={() => setShowFlashcardPlayer(false)} onGenerateNew={() => {}} isLoading={false} />}
            
            <style>{`.aspect-video { position: relative; width: 100%; padding-top: 56.25%; } .aspect-video iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }`}</style>
            
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                 <div className="flex-grow flex justify-start sm:justify-center overflow-x-auto pt-4 pb-12 -ml-4 sm:ml-0 pl-4 sm:pl-0">
                     <Stepper currentStep={currentStepIndex} steps={dynamicSteps} />
                </div>
                <Button variant="ghost" onClick={onEndSession} className="flex-shrink-0">End Session</Button>
            </div>
            
            <div>{renderContent()}</div>
        </div>
    );
};