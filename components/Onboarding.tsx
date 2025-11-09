
import React, { useState } from 'react';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';
import * as geminiService from '../services/geminiService';
// FIX: Import OnboardingStep from the shared types file and remove the local definition.
import { User, UserRole, OnboardingStep } from '../types';

interface OnboardingProps {
  steps: OnboardingStep[];
  initialData: User;
  onComplete: (formData: any, welcomeMessage: string) => void;
  welcomePromptGenerator: (formData: any) => string;
  userRole: UserRole;
}

export const Onboarding: React.FC<OnboardingProps> = ({ steps, initialData, onComplete, welcomePromptGenerator, userRole }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [formData, setFormData] = useState<any>(() => {
    // Initialize form data from steps and initialData
    const initialFormState: { [key: string]: any } = {
        name: initialData.name,
    };
    steps.forEach(step => {
        if (step.id in initialData) {
            initialFormState[step.id] = (initialData as any)[step.id];
        } else if (step.type === 'checkbox') {
            initialFormState[step.id] = [];
        } else {
            initialFormState[step.id] = '';
        }
    });
    return initialFormState;
  });

  const [isLoading, setIsLoading] = useState(false);

  const stepConfig = steps[currentStep];

  const handleInputChange = (id: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: string, value: string) => {
    setFormData((prev: any) => {
      const currentValues = prev[id] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item: string) => item !== value)
        : [...currentValues, value];
      return { ...prev, [id]: newValues };
    });
  };

  const isStepValid = () => {
    if (!stepConfig.required) return true;
    const value = formData[stepConfig.id];
    if (Array.isArray(value)) return value.length > 0;
    return value && String(value).trim() !== '';
  };

  const handleNext = () => {
    if (isStepValid()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;
    setIsLoading(true);
    const prompt = welcomePromptGenerator(formData);
    const systemInstruction = userRole === UserRole.STUDENT
      ? 'You are an expert educational planner creating a short, motivational starting plan for a new student.'
      : 'You are a community manager welcoming a new teacher to an educational platform.';

    const welcomeMessage = await geminiService.generateComplexResponse(prompt, systemInstruction);
    
    onComplete(formData, welcomeMessage);
  };
  
  const renderInput = () => {
    switch (stepConfig.type) {
      case 'text':
        return <input type="text" value={formData[stepConfig.id]} onChange={e => handleInputChange(stepConfig.id, e.target.value)} placeholder={stepConfig.placeholder} className="w-full p-3 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 bg-base-100" />;
      case 'textarea':
        return <textarea value={formData[stepConfig.id]} onChange={e => handleInputChange(stepConfig.id, e.target.value)} placeholder={stepConfig.placeholder} rows={4} className="w-full p-3 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 bg-base-100" />;
      case 'select':
        return <select value={formData[stepConfig.id]} onChange={e => handleInputChange(stepConfig.id, e.target.value)} className="w-full p-3 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-200 bg-base-100">
          {stepConfig.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>;
      case 'radio':
        return <div className="space-y-2">
            {stepConfig.options?.map(opt => (
                <button key={opt} onClick={() => handleInputChange(stepConfig.id, opt)} className={`w-full text-left p-3 border rounded-md transition-colors ${formData[stepConfig.id] === opt ? 'bg-brand-primary text-white border-brand-primary' : 'border-base-300 hover:bg-base-200 text-content'}`}>
                    {opt}
                </button>
            ))}
        </div>;
      case 'checkbox':
        return <div className="grid grid-cols-2 gap-3">
             {stepConfig.options?.map(opt => {
                const isSelected = formData[stepConfig.id]?.includes(opt.value);
                return (
                    <button key={opt.value} onClick={() => handleCheckboxChange(stepConfig.id, opt.value)} className={`flex flex-col items-center justify-center gap-2 p-4 border rounded-md transition-colors ${isSelected ? 'bg-brand-primary text-white border-brand-primary' : 'border-base-300 hover:bg-base-200 text-content'}`}>
                        <Icon icon={opt.icon as any} className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-brand-primary'}`} />
                        <span className="font-medium">{opt.value}</span>
                    </button>
                )
            })}
        </div>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <Card className="w-full max-w-2xl">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <Spinner label="Finalizing your setup..." size="lg" />
            <p className="text-center text-content/80">We're getting everything ready for you!</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-2xl font-bold text-content">Welcome to EduMentor AI!</h2>
                    <p className="text-sm text-content/60">
                        Step {currentStep + 1} of {steps.length}
                    </p>
                </div>
                <div className="flex gap-1.5 w-full">
                    {steps.map((_, index) => (
                        <div key={index} className={`h-1.5 rounded-full flex-1 ${currentStep >= index ? 'bg-brand-primary' : 'bg-base-300'}`}></div>
                    ))}
                </div>
            </div>

            <div className="mb-6 min-h-[180px]">
              <label className="block text-lg font-semibold text-content mb-1">{stepConfig.question}</label>
              <p className="text-sm text-content/70 mb-4">{stepConfig.description}</p>
              {renderInput()}
            </div>

            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 0}>
                Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} disabled={!isStepValid()}>Next</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!isStepValid()}>
                  Finish Setup
                </Button>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
