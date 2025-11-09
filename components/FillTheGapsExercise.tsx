import React, { useState } from 'react';
import { FillTheGapsExercise as Exercise } from '../types';
import { Button } from './common/Button';
import { Icon } from './common/Icon';

interface FillTheGapsExerciseProps {
  exercise: Exercise[];
  onGenerateNew: () => void;
}

type Status = 'unanswered' | 'correct' | 'incorrect';

export const FillTheGapsExercise: React.FC<FillTheGapsExerciseProps> = ({ exercise, onGenerateNew }) => {
    const [userAnswers, setUserAnswers] = useState<string[]>(Array(exercise.length).fill(''));
    const [results, setResults] = useState<Status[]>(Array(exercise.length).fill('unanswered'));
    const [submitted, setSubmitted] = useState(false);

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...userAnswers];
        newAnswers[index] = value;
        setUserAnswers(newAnswers);
        if (submitted) {
            setSubmitted(false);
            setResults(Array(exercise.length).fill('unanswered'));
        }
    };
    
    const checkAnswers = () => {
        const newResults = userAnswers.map((answer, index) => {
            const correctAnswer = exercise[index].answer.trim();
            return answer.trim().toLowerCase() === correctAnswer.toLowerCase() ? 'correct' : 'incorrect';
        });
        setResults(newResults);
        setSubmitted(true);
    };
    
    const resetExercise = () => {
        setUserAnswers(Array(exercise.length).fill(''));
        setResults(Array(exercise.length).fill('unanswered'));
        setSubmitted(false);
    };

    const score = results.filter(r => r === 'correct').length;

    const inputClasses = (status: Status) => {
        const base = "border-b-2 mx-2 px-1 text-center bg-transparent focus:outline-none transition-colors duration-200";
        if (!submitted) return `${base} border-base-300 focus:border-brand-primary`;
        if (status === 'correct') return `${base} border-green-500 text-green-700`;
        if (status === 'incorrect') return `${base} border-red-500 text-red-700`;
        return `${base} border-base-300`;
    };

    if (exercise.length === 0 || (exercise.length === 1 && exercise[0].answer === "Error")) {
        return (
            <div className="border-t border-base-300 pt-4 text-center text-content/70">
                <p>{exercise[0]?.sentence_start || 'Could not load exercise.'}{exercise[0]?.sentence_end || ''}</p>
            </div>
        )
    }

    return (
        <div className="border-t border-base-300 pt-4 space-y-4">
            <h5 className="font-bold text-lg">Fill in the Gaps</h5>
            <div className="space-y-3">
            {exercise.map((item, index) => (
                <div key={index} className="flex items-center flex-wrap text-content/90 leading-loose">
                    <span>{index + 1}. {item.sentence_start}</span>
                    <input
                        type="text"
                        value={userAnswers[index]}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        className={inputClasses(results[index])}
                        style={{ width: `${Math.max(item.answer.length * 0.9, 8)}ch` }}
                        disabled={submitted && results[index] === 'correct'}
                        aria-label={`Gap for sentence ${index + 1}`}
                    />
                    <span>{item.sentence_end}</span>
                    {submitted && results[index] === 'incorrect' && (
                        <span className="text-sm text-red-600 font-medium ml-2">(Answer: {item.answer})</span>
                    )}
                </div>
            ))}
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-base-200">
                 <div className="flex flex-wrap gap-4">
                     <Button onClick={checkAnswers} disabled={submitted || userAnswers.some(a => a.trim() === '')}>Check Answers</Button>
                     {submitted && <Button onClick={resetExercise} variant="ghost">Try Again</Button>}
                      <Button onClick={onGenerateNew} variant="ghost" leftIcon={<Icon icon="sparkles" className="w-4 h-4"/>}>
                        New Exercise
                     </Button>
                 </div>
                 {submitted && (
                    <div className="font-semibold text-right text-lg">
                        <p>Score: <span className={score === exercise.length ? 'text-brand-secondary' : ''}>{score} / {exercise.length}</span></p>
                    </div>
                 )}
            </div>
        </div>
    );
};