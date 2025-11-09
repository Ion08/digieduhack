import React from 'react';
import { TestResult } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { MarkdownRenderer } from './common/MarkdownRenderer';

interface TestReportProps {
  result: TestResult;
  onRestart: () => void;
  continueButtonText?: string;
}

const ScoreBar: React.FC<{ label: string; score: number; max: number }> = ({ label, score, max }) => {
    const percentage = max > 0 ? (score / max) * 100 : 0;
    const color = percentage >= 70 ? 'bg-brand-secondary' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-sm font-semibold">{score}/{max}</p>
            </div>
            <div className="w-full bg-base-200 rounded-full h-2.5">
                <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export const TestReport: React.FC<TestReportProps> = ({ result, onRestart, continueButtonText }) => {
  const isPassing = result.overallScore >= 70;

  return (
    <div className="p-4 space-y-6">
      <Card className={`border-2 ${isPassing ? 'border-brand-secondary' : 'border-yellow-500'}`}>
        <div className="text-center">
            <h3 className="text-2xl font-bold">Test Complete!</h3>
            <p className="text-lg font-semibold mt-2">Overall Score</p>
            <p className={`text-6xl font-bold my-2 ${isPassing ? 'text-brand-secondary' : 'text-yellow-600'}`}>
                {result.overallScore}
                <span className="text-2xl text-content/70">%</span>
            </p>
            <p className="text-content/80 max-w-md mx-auto">{result.feedback}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <h4 className="font-bold text-lg mb-4">Score Breakdown</h4>
            <div className="space-y-4">
                {result.scores.true_false > 0 && <ScoreBar label="True or False" score={result.scores.true_false} max={10} />}
                {result.scores.fill_the_gaps > 0 && <ScoreBar label="Fill in the Gaps" score={result.scores.fill_the_gaps} max={10} />}
                {result.scores.definitions > 0 && <ScoreBar label="Definitions" score={result.scores.definitions} max={10} />}
                {result.scores.create_questions > 0 && <ScoreBar label="Create Questions" score={result.scores.create_questions} max={5} />}
                {result.scores.oral_explanation > 0 && <ScoreBar label="Oral Explanation" score={result.scores.oral_explanation} max={5} />}
            </div>
        </Card>
        <div className="space-y-6">
            <Card>
                <h4 className="font-bold text-lg mb-2 flex items-center"><Icon icon="checkCircle" className="w-5 h-5 mr-2 text-green-500" />Strengths</h4>
                <MarkdownRenderer content={result.strengths} />
            </Card>
            <Card>
                <h4 className="font-bold text-lg mb-2 flex items-center"><Icon icon="lightbulb" className="w-5 h-5 mr-2 text-yellow-500" />Areas for Improvement</h4>
                <MarkdownRenderer content={result.areasForImprovement} />
            </Card>
        </div>
      </div>
      
      <div className="text-center pt-4">
        {!isPassing && !continueButtonText && (
            <p className="mb-4 text-yellow-700 font-semibold">Your score is below 70%. We recommend another study cycle to master the material.</p>
        )}
        <Button onClick={onRestart} size="md" className="min-w-[200px]">
            {continueButtonText || (isPassing ? 'Review Again' : 'Start New Adapted Session')}
        </Button>
      </div>

    </div>
  );
};