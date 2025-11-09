import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';

interface FlashcardPlayerProps {
  cards: Flashcard[];
  onEndSession: () => void;
  onGenerateNew: () => void;
  isLoading: boolean;
}

export const FlashcardPlayer: React.FC<FlashcardPlayerProps> = ({ cards, onEndSession, onGenerateNew, isLoading }) => {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    // Shuffle the initial cards for a better learning experience
    setDeck([...cards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionComplete(false);
  }, [cards]);

  const goToNextCard = () => {
    setIsFlipped(false);
    // Short delay to allow flip animation before content changes
    setTimeout(() => {
      if (currentIndex + 1 < deck.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setSessionComplete(true);
      }
    }, 200);
  };

  const handleDidNotKnow = () => {
    const currentCard = deck[currentIndex];
    setDeck(prev => [...prev, currentCard]); // Add card to the end of the deck
    goToNextCard();
  };

  const handleKnewIt = () => {
    goToNextCard(); // Simply move to the next card
  };
  
  const currentCard = deck[currentIndex];
  const progressPercentage = deck.length > 0 ? ((currentIndex) / deck.length) * 100 : 0;


  if (!currentCard && !sessionComplete && !isLoading) {
      return null;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl flex flex-col h-[80vh] relative items-center justify-center">
            <Spinner label="Generating new flashcards..." size="lg" />
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl flex flex-col h-[80vh] relative">
        <Button variant="ghost" className="!absolute top-2 right-2" onClick={onEndSession} aria-label="Close flashcards">
          <Icon icon="close" />
        </Button>
        
        {sessionComplete ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <Icon icon="checkCircle" className="w-24 h-24 text-brand-secondary mb-4" />
                <h2 className="text-2xl font-bold">Great work!</h2>
                <p className="text-content/70 mt-2 mb-6">You've completed this flashcard session.</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button onClick={onEndSession}>Return to Lesson</Button>
                  <Button onClick={onGenerateNew} variant="secondary" leftIcon={<Icon icon="sparkles" className="w-4 h-4"/>}>
                    Generate New Set
                  </Button>
                </div>
            </div>
        ) : (
            <>
                <div className="mb-4">
                    <h3 className="text-xl font-bold">Flashcards</h3>
                    <p className="text-sm text-content/60">Card {currentIndex + 1} of {deck.length}</p>
                    <div className="w-full bg-base-200 rounded-full h-2.5 mt-2">
                         <div className="bg-brand-secondary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                <div className="flex-grow flex items-center justify-center">
                    <div 
                        className="w-full h-64 perspective-1000"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                            {/* Front of card */}
                            <div className="absolute w-full h-full backface-hidden bg-base-100 border border-base-300 rounded-lg flex items-center justify-center p-6 text-center">
                                <p className="text-xl font-semibold">{currentCard?.front}</p>
                            </div>
                            {/* Back of card */}
                            <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-brand-primary/10 border border-brand-primary/50 rounded-lg flex items-center justify-center p-6 text-center">
                                <p className="text-lg">{currentCard?.back}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                 <div className="h-20 flex items-center justify-center">
                    {isFlipped ? (
                        <div className="flex gap-4">
                            <Button onClick={handleDidNotKnow} className="bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white" leftIcon={<Icon icon="xCircle" />}>
                                I didn't know
                            </Button>
                            <Button onClick={handleKnewIt} className="bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white" leftIcon={<Icon icon="checkCircle" />}>
                                I knew it
                            </Button>
                        </div>
                    ) : (
                        <p className="text-content/60 animate-pulse">Click card to reveal answer</p>
                    )}
                </div>
            </>
        )}

      </Card>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};