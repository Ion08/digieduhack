import React, { useState, useCallback } from 'react';
import { TestExercises, TestResult, TrueFalseQuestion, FillTheGapsExercise, DefinitionTerm } from '../types';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Spinner } from './common/Spinner';


// Individual Exercise Components
const ExerciseTrueFalse: React.FC<{ questions: TrueFalseQuestion[], answers: (boolean | null)[], onChange: (index: number, answer: boolean) => void }> = ({ questions, answers, onChange }) => (
    <div className="space-y-4">
        {questions.map((q, index) => (
            <div key={index}>
                <p className="mb-2">{index + 1}. {q.statement}</p>
                <div className="flex gap-4">
                    {[true, false].map(val => (
                        <Button
                            key={String(val)}
                            variant={answers[index] === val ? 'primary' : 'ghost'}
                            onClick={() => onChange(index, val)}
                            className="w-24"
                        >
                            {val ? 'True' : 'False'}
                        </Button>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const ExerciseFillTheGaps: React.FC<{ questions: FillTheGapsExercise[], answers: string[], onChange: (index: number, answer: string) => void }> = ({ questions, answers, onChange }) => (
    <div className="space-y-4">
        {questions.map((q, index) => (
            <div key={index} className="flex items-center flex-wrap leading-loose">
                <span>{index + 1}. {q.sentence_start}</span>
                <input
                    type="text"
                    value={answers[index]}
                    onChange={(e) => onChange(index, e.target.value)}
                    className="border-b-2 mx-2 px-1 text-center bg-transparent focus:outline-none focus:border-brand-primary"
                    style={{ width: `${Math.max(q.answer.length * 0.9, 10)}ch` }}
                />
                <span>{q.sentence_end}</span>
            </div>
        ))}
    </div>
);

const ExerciseDefinitions: React.FC<{ terms: DefinitionTerm[], answers: string[], onChange: (index: number, answer: string) => void }> = ({ terms, answers, onChange }) => (
    <div className="space-y-4">
        <p className="text-sm text-content/70">Provide a one-sentence definition for each term.</p>
        {terms.map((t, index) => (
            <div key={index}>
                <label className="font-semibold">{index + 1}. {t.term}</label>
                <textarea
                    value={answers[index]}
                    onChange={(e) => onChange(index, e.target.value)}
                    className="w-full mt-1 p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary"
                    rows={2}
                />
            </div>
        ))}
    </div>
);

const ExerciseCreateQuestions: React.FC<{ answers: string[], onChange: (index: number, answer: string) => void }> = ({ answers, onChange }) => (
     <div className="space-y-4">
        <p className="text-sm text-content/70">Create 5 relevant questions based on the study material.</p>
        {answers.map((_, index) => (
            <div key={index} className="flex items-center gap-2">
                <span className="font-semibold">{index + 1}.</span>
                 <input
                    type="text"
                    value={answers[index]}
                    onChange={(e) => onChange(index, e.target.value)}
                    className="w-full p-2 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary"
                    placeholder="Your question..."
                />
            </div>
        ))}
    </div>
);

// Placeholder for the complex oral exercise component
const ExerciseOral: React.FC<{ onComplete: (transcript: string) => void }> = ({ onComplete }) => {
    // This would contain the full implementation of the Live API
    const [isRecording, setIsRecording] = useState(false);
    return (
        <div className="text-center">
            <p className="mb-4">This exercise requires your microphone. You will have up to 5 minutes to explain the topic.</p>
            <Button onClick={() => {
                alert("The full interactive oral exam is a complex feature. For this demo, we'll use a sample transcript for evaluation.");
                onComplete("In this chapter, I learned that arithmetic sequences have a common difference, while geometric sequences have a common ratio. This is a key distinction for solving problems related to series and financial calculations.");
            }}>
                Start Mock Oral Exam
            </Button>
        </div>
    );
};


interface TestStepperProps {
  exercises: TestExercises;
  sourceContext: string;
  onTestComplete: (result: TestResult) => void;
  includeAdvancedSteps?: boolean;
}

const ALL_EXERCISE_STEPS = [
    { title: "True or False", icon: "checkCircle" },
    { title: "Fill in the Gaps", icon: "fillGaps" },
    { title: "Define the Terms", icon: "lightbulb" },
    { title: "Create Questions", icon: "sparkles" },
    { title: "Oral Explanation", icon: "chat" },
] as const;


export const TestStepper: React.FC<TestStepperProps> = ({ exercises, sourceContext, onTestComplete, includeAdvancedSteps = false }) => {
    const [step, setStep] = useState(0);
    const [isEvaluating, setIsEvaluating] = useState(false);
    
    const steps = includeAdvancedSteps ? ALL_EXERCISE_STEPS : ALL_EXERCISE_STEPS.slice(0, 3);
    
    // State for all answers
    const [tfAnswers, setTfAnswers] = useState<(boolean|null)[]>(() => Array(exercises.true_false_questions.length).fill(null));
    const [figAnswers, setFigAnswers] = useState<string[]>(() => Array(exercises.fill_the_gaps_questions.length).fill(''));
    const [defAnswers, setDefAnswers] = useState<string[]>(() => Array(exercises.definition_terms.length).fill(''));
    const [cqAnswers, setCqAnswers] = useState<string[]>(Array(5).fill(''));
    const [oralTranscript, setOralTranscript] = useState<string>('');
    
    const isStepComplete = useCallback(() => {
        switch(step) {
            case 0: return tfAnswers.every(a => a !== null);
            case 1: return figAnswers.every(a => a.trim() !== '');
            case 2: return defAnswers.every(a => a.trim() !== '');
            case 3: return cqAnswers.every(a => a.trim() !== '');
            case 4: return oralTranscript.trim() !== '';
            default: return false;
        }
    }, [step, tfAnswers, figAnswers, defAnswers, cqAnswers, oralTranscript]);

    const handleFinish = async () => {
        setIsEvaluating(true);
        
        // --- MOCK EVALUATION LOGIC ---
        // Simulate a delay for a better user experience, without API calls.
        await new Promise(resolve => setTimeout(resolve, 1500));

        const tfScore = exercises.true_false_questions.reduce((score, q, i) => score + (q.correct_answer === tfAnswers[i] ? 1 : 0), 0);
        const figScore = exercises.fill_the_gaps_questions.reduce((score, q, i) => score + (q.answer.trim().toLowerCase() === figAnswers[i].trim().toLowerCase() ? 1 : 0), 0);
        
        // For semantic questions, generate plausible mock scores based on effort (i.e., length of answer).
        const defScore = defAnswers.reduce((score, answer) => score + (answer.trim().length > 10 ? 1 : 0), 0);
        const cqScore = includeAdvancedSteps ? cqAnswers.reduce((score, answer) => score + (answer.trim().length > 15 ? 1 : 0), 0) : 0;
        const oralScore = includeAdvancedSteps ? (oralTranscript.length > 50 ? 4 : oralTranscript.length > 20 ? 2 : 0) : 0; // Simplified score

        const maxScores = {
            true_false: exercises.true_false_questions.length,
            fill_the_gaps: exercises.fill_the_gaps_questions.length,
            definitions: exercises.definition_terms.length,
            create_questions: includeAdvancedSteps ? 5 : 0,
            oral_explanation: includeAdvancedSteps ? 5 : 0,
        };

        const totalScore = tfScore + figScore + defScore + cqScore + oralScore;
        const maxTotalScore = Object.values(maxScores).reduce((sum, max) => sum + max, 0);
        const overallScore = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;

        const mockReport = {
            overallScore,
            feedback: `Great effort! You achieved a score of ${overallScore}%. This mock report provides a snapshot of your performance based on your answers.`,
            strengths: `
*   Completed all sections of the test.
*   Strong performance on multiple-choice and fill-in-the-gap questions.
            `,
            areasForImprovement: `
*   Some definitions could be more detailed.
*   Review the source material again to solidify concepts you were unsure about.
            `
        };

        onTestComplete({
            id: `result-${Date.now()}`,
            timestamp: new Date().toISOString(),
            scores: {
                true_false: tfScore,
                fill_the_gaps: figScore,
                definitions: defScore,
                create_questions: cqScore,
                oral_explanation: oralScore,
            },
            ...mockReport,
        });
    };

    const renderCurrentStep = () => {
        switch(step) {
            case 0: return <ExerciseTrueFalse questions={exercises.true_false_questions} answers={tfAnswers} onChange={(i, a) => setTfAnswers(p => { const n = [...p]; n[i] = a; return n; })} />;
            case 1: return <ExerciseFillTheGaps questions={exercises.fill_the_gaps_questions} answers={figAnswers} onChange={(i, a) => setFigAnswers(p => { const n = [...p]; n[i] = a; return n; })} />;
            case 2: return <ExerciseDefinitions terms={exercises.definition_terms} answers={defAnswers} onChange={(i, a) => setDefAnswers(p => { const n = [...p]; n[i] = a; return n; })} />;
            case 3: return <ExerciseCreateQuestions answers={cqAnswers} onChange={(i, a) => setCqAnswers(p => { const n = [...p]; n[i] = a; return n; })} />;
            case 4: return <ExerciseOral onComplete={setOralTranscript} />;
            default: return null;
        }
    };

    if(isEvaluating) {
        return <div className="flex flex-col items-center justify-center h-full gap-4"><Spinner label="Evaluating your answers..." size="lg"/><p className="text-sm text-center text-content/70">Finalizing your report...</p></div>;
    }

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="mb-4">
                <h3 className="font-bold text-lg flex items-center">
                    <Icon icon={steps[step].icon as any} className="w-5 h-5 mr-2" />
                    {steps[step].title}
                </h3>
                <p className="text-sm text-content/60">Step {step + 1} of {steps.length}</p>
            </div>
            <div className="flex-grow overflow-y-auto">
                {renderCurrentStep()}
            </div>
            <div className="mt-6 pt-4 border-t border-base-300 flex justify-between items-center">
                <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 0}>Back</Button>
                {step < steps.length - 1 ? (
                     <Button onClick={() => setStep(s => s + 1)} disabled={!isStepComplete()}>Next</Button>
                ) : (
                    <Button onClick={handleFinish} disabled={!isStepComplete()}>Finish Test</Button>
                )}
            </div>
        </div>
    );
};